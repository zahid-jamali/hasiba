import { describe, it, expect } from 'vitest';
import {
  calculateZakat,
  calculateMetalPrices,
  getRatesForCurrency,
  FALLBACK_PRICES_DATA,
  SUPPORTED_CURRENCIES,
  TROY_OUNCE_TO_GRAMS,
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  ZAKAT_RATE,
  SupportedCurrency,
} from './zakat';

describe('Zakat Calculation Library (lib/zakat.ts)', () => {
  const standardRates = {
    xauUsdOz: 2685.4,
    xagUsdOz: 31.42,
    fxRate: 3.75, // SAR
  };

  describe('Metal Prices Conversion & Rates Helper', () => {
    it('accurately computes 24K, 22K, 21K, 18K gold and silver per gram', () => {
      const prices = calculateMetalPrices(standardRates);

      const expected24K = (2685.4 / TROY_OUNCE_TO_GRAMS) * 3.75;
      const expected22K = (expected24K * 22) / 24;
      const expected21K = (expected24K * 21) / 24;
      const expected18K = (expected24K * 18) / 24;
      const expectedSilver = (31.42 / TROY_OUNCE_TO_GRAMS) * 3.75;

      expect(prices.gram24K).toBeCloseTo(expected24K, 4);
      expect(prices.gram22K).toBeCloseTo(expected22K, 4);
      expect(prices.gram21K).toBeCloseTo(expected21K, 4);
      expect(prices.gram18K).toBeCloseTo(expected18K, 4);
      expect(prices.gramSilver).toBeCloseTo(expectedSilver, 4);
    });

    it('retrieves rates for all 11 supported currencies with fallback baseline', () => {
      const currencies: SupportedCurrency[] = [
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
        'USD',
      ];

      for (const curr of currencies) {
        const rates = getRatesForCurrency(FALLBACK_PRICES_DATA, curr);
        expect(rates.xauUsdOz).toBe(2685.4);
        expect(rates.xagUsdOz).toBe(31.42);
        expect(rates.fxRate).toBeGreaterThan(0);
        if (curr === 'USD') {
          expect(rates.fxRate).toBe(1);
        }
        expect(SUPPORTED_CURRENCIES[curr].code).toBe(curr);
      }
    });

    it('falls back safely when prices data is null or undefined', () => {
      const rates = getRatesForCurrency(null, 'SAR');
      expect(rates.xauUsdOz).toBe(FALLBACK_PRICES_DATA.xauUsdOz);
      expect(rates.fxRate).toBe(FALLBACK_PRICES_DATA.fx.SAR);
    });
  });

  describe('Core Zakat Calculations', () => {
    it('Zero assets -> zero zakat', () => {
      const result = calculateZakat({}, standardRates);

      expect(result.totalAssets).toBe(0);
      expect(result.totalDeductions).toBe(0);
      expect(result.netZakatableWealth).toBe(0);
      expect(result.isNisabReached).toBe(false);
      expect(result.zakatDue).toBe(0);
      expect(result.assetBreakdown.length).toBe(6);
    });

    it('Below nisab -> isNisabReached false, zakatDue 0', () => {
      const prices = calculateMetalPrices(standardRates);
      const goldNisabValue = GOLD_NISAB_GRAMS * prices.gram24K; // ~ 27,516 SAR

      // Possesses 10,000 SAR (well below gold nisab of ~27.5k SAR)
      const result = calculateZakat(
        {
          cashAtHome: 4000,
          bankBalances: 6000,
          nisabStandard: 'gold',
        },
        standardRates
      );

      expect(result.totalAssets).toBe(10000);
      expect(result.netZakatableWealth).toBe(10000);
      expect(result.goldNisabValue).toBeCloseTo(goldNisabValue, 2);
      expect(result.selectedNisabValue).toBeCloseTo(goldNisabValue, 2);
      expect(result.isNisabReached).toBe(false);
      expect(result.zakatDue).toBe(0);
    });

    it('Above gold nisab -> exactly 2.5% of netZakatableWealth', () => {
      // Net wealth = 100,000 SAR
      const result = calculateZakat(
        {
          bankBalances: 100000,
          nisabStandard: 'gold',
        },
        standardRates
      );

      expect(result.netZakatableWealth).toBe(100000);
      expect(result.isNisabReached).toBe(true);
      expect(result.zakatDue).toBe(100000 * ZAKAT_RATE);
      expect(result.zakatDue).toBe(2500);
    });

    it('Silver nisab threshold toggle', () => {
      const prices = calculateMetalPrices(standardRates);
      const goldNisab = GOLD_NISAB_GRAMS * prices.gram24K; // ~27,516 SAR
      const silverNisab = SILVER_NISAB_GRAMS * prices.gramSilver; // ~2,254 SAR

      expect(silverNisab).toBeLessThan(goldNisab);

      // Wealth of 8,000 SAR: above silver nisab (~2,254), but below gold nisab (~27,516)
      const goldResult = calculateZakat(
        {
          bankBalances: 8000,
          nisabStandard: 'gold',
        },
        standardRates
      );
      expect(goldResult.isNisabReached).toBe(false);
      expect(goldResult.zakatDue).toBe(0);
      expect(goldResult.selectedNisabValue).toBeCloseTo(goldNisab, 2);

      const silverResult = calculateZakat(
        {
          bankBalances: 8000,
          nisabStandard: 'silver',
        },
        standardRates
      );
      expect(silverResult.isNisabReached).toBe(true);
      expect(silverResult.selectedNisabValue).toBeCloseTo(silverNisab, 2);
      expect(silverResult.zakatDue).toBe(8000 * 0.025); // 200 SAR
    });

    it('Deducting debts due now', () => {
      // Gross cash = 100,000 SAR, immediate debt = 20,000 SAR
      const result = calculateZakat(
        {
          bankBalances: 100000,
          debtsDueNow: 20000,
          nisabStandard: 'gold',
        },
        standardRates
      );

      expect(result.totalAssets).toBe(100000);
      expect(result.totalDeductions).toBe(20000);
      expect(result.netZakatableWealth).toBe(80000);
      expect(result.isNisabReached).toBe(true);
      expect(result.zakatDue).toBe(80000 * 0.025); // 2,000 SAR
    });

    it('handles debts exceeding total assets safely', () => {
      const result = calculateZakat(
        {
          bankBalances: 15000,
          debtsDueNow: 30000,
        },
        standardRates
      );

      expect(result.totalAssets).toBe(15000);
      expect(result.totalDeductions).toBe(30000);
      expect(result.netZakatableWealth).toBe(0);
      expect(result.isNisabReached).toBe(false);
      expect(result.zakatDue).toBe(0);
    });

    it('Accurate multi-karat gold and silver conversion', () => {
      const prices = calculateMetalPrices(standardRates);

      const goldGrams = {
        '24K': 10,
        '22K': 15,
        '21K': 20,
        '18K': 25,
      };
      const silverGrams = 200;

      const expectedGoldVal =
        10 * prices.gram24K +
        15 * prices.gram22K +
        20 * prices.gram21K +
        25 * prices.gram18K;

      const expectedSilverVal = 200 * prices.gramSilver;

      const result = calculateZakat(
        {
          goldGrams,
          silverGrams,
          nisabStandard: 'gold',
        },
        standardRates
      );

      expect(result.totalAssets).toBeCloseTo(expectedGoldVal + expectedSilverVal, 2);

      const goldBreakdown = result.assetBreakdown.find((b) => b.categoryKey === 'gold');
      const silverBreakdown = result.assetBreakdown.find((b) => b.categoryKey === 'silver');

      expect(goldBreakdown?.amount).toBeCloseTo(expectedGoldVal, 2);
      expect(silverBreakdown?.amount).toBeCloseTo(expectedSilverVal, 2);
    });

    it('computes all categories and percentage breakdown correctly', () => {
      const result = calculateZakat(
        {
          cashAtHome: 10000,
          bankBalances: 40000,
          investmentsMarketValue: 30000,
          businessStockValue: 20000,
          moneyOwedToYou: 10000,
          debtsDueNow: 10000,
          nisabStandard: 'gold',
        },
        standardRates
      );

      expect(result.totalAssets).toBe(110000);
      expect(result.totalDeductions).toBe(10000);
      expect(result.netZakatableWealth).toBe(100000);
      expect(result.isNisabReached).toBe(true);
      expect(result.zakatDue).toBe(2500);

      // Verify percentages sum to 100%
      const totalPct = result.assetBreakdown.reduce((sum, item) => sum + item.percentage, 0);
      expect(totalPct).toBeCloseTo(100, 2);
    });

    it('exact nisab boundary triggers isNisabReached', () => {
      const prices = calculateMetalPrices(standardRates);
      const exactGoldNisab = GOLD_NISAB_GRAMS * prices.gram24K;

      const result = calculateZakat(
        {
          bankBalances: exactGoldNisab,
          nisabStandard: 'gold',
        },
        standardRates
      );

      expect(result.isNisabReached).toBe(true);
      expect(result.zakatDue).toBeCloseTo(exactGoldNisab * 0.025, 4);
    });
  });
});
