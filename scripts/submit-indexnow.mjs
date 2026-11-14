#!/usr/bin/env node

/**
 * scripts/submit-indexnow.mjs
 * 
 * Automatically submits website URLs to Microsoft Bing and participating search engines
 * (Bing, Yandex, Naver, Seznam) using the IndexNow open protocol.
 * 
 * Protocol specification: https://www.indexnow.org/documentation
 * 
 * Usage:
 *   node scripts/submit-indexnow.mjs                  # Submits all URLs from sitemap / gsc-urls.txt
 *   node scripts/submit-indexnow.mjs <url1> <url2>   # Submits specific updated URLs
 *   INDEXNOW_KEY=your_key node scripts/submit-indexnow.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const HOST = 'hasiba.zetawala.com';
const DEFAULT_KEY = '7e52a986aa4b59606d1f8048fab426ec';
const KEY = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// IndexNow API endpoints
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
];

/**
 * Ensures the verification key file exists in public/ (and out/ if built).
 */
function ensureKeyFiles() {
  const publicPath = path.join(ROOT_DIR, 'public', `${KEY}.txt`);
  if (!fs.existsSync(publicPath) || fs.readFileSync(publicPath, 'utf8').trim() !== KEY) {
    fs.writeFileSync(publicPath, KEY, 'utf8');
    console.log(`[IndexNow] Created key verification file: public/${KEY}.txt`);
  }

  const outPath = path.join(ROOT_DIR, 'out', `${KEY}.txt`);
  if (fs.existsSync(path.join(ROOT_DIR, 'out'))) {
    if (!fs.existsSync(outPath) || fs.readFileSync(outPath, 'utf8').trim() !== KEY) {
      fs.writeFileSync(outPath, KEY, 'utf8');
      console.log(`[IndexNow] Created key verification file: out/${KEY}.txt`);
    }
  }
}

/**
 * Collects URLs to submit from arguments, sitemap.xml, or gsc-urls.txt.
 */
function collectUrls() {
  const cliArgs = process.argv.slice(2).filter((arg) => arg.startsWith('http'));
  if (cliArgs.length > 0) {
    return cliArgs;
  }

  // 1. Try out/sitemap.xml
  const sitemapPath = path.join(ROOT_DIR, 'out', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1].trim());
    if (matches.length > 0) {
      return matches;
    }
  }

  // 2. Try gsc-urls.txt
  const gscPath = path.join(ROOT_DIR, 'gsc-urls.txt');
  if (fs.existsSync(gscPath)) {
    const lines = fs
      .readFileSync(gscPath, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('http'));
    if (lines.length > 0) {
      return lines;
    }
  }

  // 3. Fallback core URLs
  return [
    `https://${HOST}/`,
    `https://${HOST}/en/`,
    `https://${HOST}/hijri-date-today/`,
    `https://${HOST}/en/hijri-date-today/`,
    `https://${HOST}/hijri-converter/`,
    `https://${HOST}/en/hijri-converter/`,
    `https://${HOST}/age-calculator/`,
    `https://${HOST}/en/age-calculator/`,
    `https://${HOST}/gold-price/`,
    `https://${HOST}/en/gold-price/`,
    `https://${HOST}/zakat-calculator/`,
    `https://${HOST}/en/zakat-calculator/`,
    `https://${HOST}/end-of-service/`,
    `https://${HOST}/en/end-of-service/`,
    `https://${HOST}/pregnancy-calculator/`,
    `https://${HOST}/en/pregnancy-calculator/`,
  ];
}

/**
 * Submits a batch of URLs to an IndexNow endpoint.
 */
async function submitBatch(endpoint, urls) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'Hasiba-IndexNow-Bot/1.0',
    },
    body: JSON.stringify(payload),
  });

  return {
    endpoint,
    status: response.status,
    statusText: response.statusText,
  };
}

async function main() {
  console.log('='.repeat(65));
  console.log('            INDEXNOW AUTOMATIC SUBMISSION TO BING            ');
  console.log('='.repeat(65));

  ensureKeyFiles();

  const urls = collectUrls();
  console.log(`[IndexNow] Host: ${HOST}`);
  console.log(`[IndexNow] API Key: ${KEY}`);
  console.log(`[IndexNow] Key Location: ${KEY_LOCATION}`);
  console.log(`[IndexNow] Total URLs to submit: ${urls.length}`);

  if (urls.length === 0) {
    console.log('[IndexNow] No URLs found to submit.');
    return;
  }

  // Chunk URLs in batches of 10,000 (IndexNow API limit)
  const BATCH_SIZE = 10000;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const chunk = urls.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE);

    console.log(`\n[IndexNow] Submitting Batch ${batchNum}/${totalBatches} (${chunk.length} URLs)...`);

    let success = false;
    for (const endpoint of ENDPOINTS) {
      try {
        console.log(`[IndexNow] Sending request to ${endpoint}...`);
        const result = await submitBatch(endpoint, chunk);

        if (result.status === 200 || result.status === 202) {
          console.log(`✓ [IndexNow] Success from ${endpoint}! HTTP ${result.status} (${result.status === 200 ? 'OK' : 'Accepted'})`);
          success = true;
          break; // Primary succeeded, no need to bombard secondary
        } else if (result.status === 400) {
          console.error(`✗ [IndexNow] HTTP 400: Invalid payload format.`);
        } else if (result.status === 403) {
          console.error(`✗ [IndexNow] HTTP 403: Key invalid or not found at ${KEY_LOCATION}.`);
          console.error(`  (Note: If website is not yet deployed to production, HTTP 403 is expected until deployed)`);
        } else if (result.status === 422) {
          console.error(`✗ [IndexNow] HTTP 422: URLs don't belong to host ${HOST}.`);
        } else if (result.status === 429) {
          console.error(`✗ [IndexNow] HTTP 429: Too many requests.`);
        } else {
          console.warn(`! [IndexNow] Unexpected status HTTP ${result.status}: ${result.statusText}`);
        }
      } catch (err) {
        console.error(`✗ [IndexNow] Connection error connecting to ${endpoint}:`, err.message);
      }
    }

    if (success) {
      console.log(`\n🎉 Successfully submitted ${chunk.length} URLs to Bing and participating engines!`);
    } else {
      console.log(`\nℹ️  IndexNow request completed. Once ${KEY_LOCATION} is live on Cloudflare/production, Bing will validate and auto-index all URLs.`);
    }
  }

  console.log('='.repeat(65));
}

main().catch((err) => {
  console.error('[IndexNow] Fatal error:', err);
  process.exit(1);
});
