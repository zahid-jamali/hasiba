#!/usr/bin/env node
/**
 * scripts/update-prices.mjs
 * Fetches gold (XAU) and silver (XAG) spot prices in USD/oz and exchange rates.
 * Writes public/data/prices.json and appends to public/data/prices-history.json.
 * Exits with non-zero status on validation or fetch failure.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../public/data');
const PRICES_FILE = path.join(DATA_DIR, 'prices.json');
const HISTORY_FILE = path.join(DATA_DIR, 'prices-history.json');

const TARGET_CURRENCIES = [
  'SAR',
  'AED',
  'EGP',
  'KWD',
  'QAR',
  'JOD',
  'IQD',
  'OMR',
  'BHD',
  'MAD',
];

/**
 * GoldApi.io Provider
 */
class GoldApiProvider {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async fetchMetals() {
    if (!this.apiKey) {
      throw new Error('GOLD_API_KEY environment variable is not defined.');
    }

    const headers = {
      'x-access-token': this.apiKey,
      'Content-Type': 'application/json',
    };

    const [resGold, resSilver] = await Promise.all([
      fetch('https://www.goldapi.io/api/XAU/USD', { headers }),
      fetch('https://www.goldapi.io/api/XAG/USD', { headers }),
    ]);

    if (!resGold.ok || !resSilver.ok) {
      throw new Error(
        `Metals API request failed: Gold=${resGold.status} (${resGold.statusText}), Silver=${resSilver.status} (${resSilver.statusText})`
      );
    }

    const goldData = await resGold.json();
    const silverData = await resSilver.json();

    const xau = Number(goldData.price);
    const xag = Number(silverData.price);

    if (isNaN(xau) || xau <= 0 || isNaN(xag) || xag <= 0) {
      throw new Error(
        `Invalid metal values received: XAU=${goldData.price}, XAG=${silverData.price}`
      );
    }

    return {
      xauUsdOz: Number(xau.toFixed(2)),
      xagUsdOz: Number(xag.toFixed(2)),
    };
  }
}

/**
 * Fallback Provider for local development / testing when no API key is provided
 */
class FallbackDevProvider {
  constructor(existing) {
    this.existing = existing;
  }

  async fetchMetals() {
    if (this.existing && this.existing.xauUsdOz && this.existing.xagUsdOz) {
      console.warn(
        '[WARN] GOLD_API_KEY missing. Preserving previous metal spot rates for dev mode.'
      );
      return {
        xauUsdOz: this.existing.xauUsdOz,
        xagUsdOz: this.existing.xagUsdOz,
      };
    }

    console.warn(
      '[WARN] GOLD_API_KEY missing and no existing data. Using baseline spot rates.'
    );
    return {
      xauUsdOz: 2685.4,
      xagUsdOz: 31.42,
    };
  }
}

/**
 * Fetch live USD exchange rates from Open Exchange Rates API
 */
async function fetchExchangeRates() {
  const url = 'https://open.er-api.com/v6/latest/USD';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`FX API request failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.result !== 'success' || !data.rates) {
    throw new Error('FX API response did not indicate success.');
  }

  const fx = {};
  for (const curr of TARGET_CURRENCIES) {
    const rate = Number(data.rates[curr]);
    if (!rate || isNaN(rate) || rate <= 0) {
      throw new Error(`Missing or invalid exchange rate for currency: ${curr}`);
    }
    fx[curr] = Number(rate.toFixed(4));
  }

  return fx;
}

/**
 * Validate new prices against sanity checks and previous baseline
 */
function validatePrices(newRecord, existing) {
  if (!newRecord.xauUsdOz || newRecord.xauUsdOz <= 0) {
    throw new Error(`Invalid gold price: ${newRecord.xauUsdOz}`);
  }
  if (!newRecord.xagUsdOz || newRecord.xagUsdOz <= 0) {
    throw new Error(`Invalid silver price: ${newRecord.xagUsdOz}`);
  }

  for (const curr of TARGET_CURRENCIES) {
    const val = newRecord.fx[curr];
    if (!val || val <= 0) {
      throw new Error(`Invalid FX rate for ${curr}: ${val}`);
    }
  }

  if (existing && existing.xauUsdOz) {
    const goldDiffPct =
      Math.abs(newRecord.xauUsdOz - existing.xauUsdOz) / existing.xauUsdOz;
    if (goldDiffPct > 0.2) {
      throw new Error(
        `Gold price shifted by ${(goldDiffPct * 100).toFixed(1)}% which exceeds the 20% safety threshold. Aborting.`
      );
    }

    const silverDiffPct =
      Math.abs(newRecord.xagUsdOz - existing.xagUsdOz) / existing.xagUsdOz;
    if (silverDiffPct > 0.2) {
      throw new Error(
        `Silver price shifted by ${(silverDiffPct * 100).toFixed(1)}% which exceeds the 20% safety threshold. Aborting.`
      );
    }
  }
}

async function main() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });

    let existingPrices = null;
    try {
      const raw = await fs.readFile(PRICES_FILE, 'utf-8');
      existingPrices = JSON.parse(raw);
    } catch {
      // File does not exist or unreadable
    }

    // Provider selection
    const apiKey = process.env.GOLD_API_KEY;
    const provider = apiKey
      ? new GoldApiProvider(apiKey)
      : new FallbackDevProvider(existingPrices);

    console.log('[1/4] Fetching metals prices...');
    const metals = await provider.fetchMetals();

    console.log('[2/4] Fetching currency exchange rates...');
    const fx = await fetchExchangeRates();

    const newRecord = {
      updatedAt: new Date().toISOString(),
      xauUsdOz: metals.xauUsdOz,
      xagUsdOz: metals.xagUsdOz,
      fx,
    };

    console.log('[3/4] Validating price thresholds...');
    validatePrices(newRecord, existingPrices);

    console.log('[4/4] Writing data files...');
    // Write current prices
    await fs.writeFile(
      PRICES_FILE,
      JSON.stringify(newRecord, null, 2),
      'utf-8'
    );
    console.log(`✓ Updated ${PRICES_FILE}`);

    // Update history (last 365 days)
    let history = [];
    try {
      const rawHistory = await fs.readFile(HISTORY_FILE, 'utf-8');
      history = JSON.parse(rawHistory);
      if (!Array.isArray(history)) history = [];
    } catch {
      history = [];
    }

    const todayStr = newRecord.updatedAt.slice(0, 10);
    const existingIndex = history.findIndex((h) => h.date === todayStr);

    const historyEntry = {
      date: todayStr,
      xauUsdOz: newRecord.xauUsdOz,
      xagUsdOz: newRecord.xagUsdOz,
      fx: newRecord.fx,
    };

    if (existingIndex >= 0) {
      history[existingIndex] = historyEntry;
    } else {
      history.push(historyEntry);
    }

    // Sort by date ascending and keep last 365 entries
    history.sort((a, b) => a.date.localeCompare(b.date));
    if (history.length > 365) {
      history = history.slice(history.length - 365);
    }

    await fs.writeFile(
      HISTORY_FILE,
      JSON.stringify(history, null, 2),
      'utf-8'
    );
    console.log(`✓ Updated ${HISTORY_FILE} (${history.length} records)`);

    console.log('Price update completed successfully.');
  } catch (err) {
    console.error('ERROR in update-prices script:', err.message);
    process.exit(1);
  }
}

main();
