import { describe, it, expect } from 'vitest';
import {
  calculateGoldPrices,
  calculateMyGoldValue,
  TROY_OUNCE_GRAMS,
  TOLA_GRAMS,
  EGYPTIAN_GOLD_POUND_GRAMS,
  PricesData,
} from './gold';

const mockPricesData: PricesData = {
  updatedAt: '2026-03-01T12:00:00.000Z',
  xauUsdOz: 2600.0,
  xagUsdOz: 31.0,
  fx: {
    SAR: 3.75,
    AED: 3.6725,
    EGP: 50.0,
    KWD: 0.31,
    USD: 1.0,
  },
};

describe('Gold and Silver Pricing Logic', () => {
  it('calculates accurate 24K gold price per gram in USD', () => {
    const prices = calculateGoldPrices(mockPricesData, 'USD');
    const expected24k = 2600.0 / TROY_OUNCE_GRAMS;
    expect(prices['24K']).toBeCloseTo(expected24k, 2);
  });

  it('calculates accurate karat purities (22K, 21K, 18K)', () => {
    const prices = calculateGoldPrices(mockPricesData, 'SAR');
    const expected24k = (2600.0 / TROY_OUNCE_GRAMS) * 3.75;
    expect(prices['24K']).toBeCloseTo(expected24k, 2);

    expect(prices['22K']).toBeCloseTo(prices['24K'] * (22 / 24), 2);
    expect(prices['21K']).toBeCloseTo(prices['24K'] * (21 / 24), 2);
    expect(prices['18K']).toBeCloseTo(prices['24K'] * (18 / 24), 2);
  });

  it('calculates Egyptian Gold Pound (8g of 21K) for EGP', () => {
    const prices = calculateGoldPrices(mockPricesData, 'EGP');
    expect(prices.egyptianGoldPound).toBeDefined();
    expect(prices.egyptianGoldPound).toBeCloseTo(
      prices['21K'] * EGYPTIAN_GOLD_POUND_GRAMS,
      1
    );
  });

  it('calculates UAE Tola (11.6638g of 24K) for AED', () => {
    const prices = calculateGoldPrices(mockPricesData, 'AED');
    expect(prices.uaeTola).toBeDefined();
    expect(prices.uaeTola).toBeCloseTo(prices['24K'] * TOLA_GRAMS, 1);
  });

  it('calculates silver price per gram correctly', () => {
    const prices = calculateGoldPrices(mockPricesData, 'SAR');
    const expectedSilver = (31.0 / TROY_OUNCE_GRAMS) * 3.75;
    expect(prices.silverGram).toBeCloseTo(expectedSilver, 2);
  });
});

describe('My Gold Value Calculator', () => {
  it('calculates raw gold value without making charges', () => {
    const result = calculateMyGoldValue(
      {
        grams: 10,
        karat: '21K',
        currency: 'SAR',
      },
      mockPricesData
    );

    const prices = calculateGoldPrices(mockPricesData, 'SAR');
    expect(result.grams).toBe(10);
    expect(result.karat).toBe('21K');
    expect(result.rawGoldTotal).toBeCloseTo(10 * prices['21K'], 2);
    expect(result.makingChargeTotal).toBe(0);
    expect(result.totalValue).toBe(result.rawGoldTotal);
    expect(result.pureGoldWeightGrams).toBeCloseTo(10 * (21 / 24), 3);
  });

  it('adds fixed making charge per gram', () => {
    const result = calculateMyGoldValue(
      {
        grams: 20,
        karat: '18K',
        currency: 'SAR',
        makingChargeType: 'fixed_per_gram',
        makingChargeValue: 35, // 35 SAR per gram
      },
      mockPricesData
    );

    const prices = calculateGoldPrices(mockPricesData, 'SAR');
    const expectedRaw = 20 * prices['18K'];
    const expectedMaking = 20 * 35; // 700 SAR
    expect(result.rawGoldTotal).toBeCloseTo(expectedRaw, 2);
    expect(result.makingChargeTotal).toBe(expectedMaking);
    expect(result.totalValue).toBeCloseTo(expectedRaw + expectedMaking, 2);
  });

  it('adds percentage making charge', () => {
    const result = calculateMyGoldValue(
      {
        grams: 15,
        karat: '24K',
        currency: 'USD',
        makingChargeType: 'percentage',
        makingChargeValue: 10, // 10%
      },
      mockPricesData
    );

    const prices = calculateGoldPrices(mockPricesData, 'USD');
    const expectedRaw = 15 * prices['24K'];
    const expectedMaking = expectedRaw * 0.1;
    expect(result.rawGoldTotal).toBeCloseTo(expectedRaw, 2);
    expect(result.makingChargeTotal).toBeCloseTo(expectedMaking, 2);
    expect(result.totalValue).toBeCloseTo(expectedRaw + expectedMaking, 2);
  });

  it('handles 0 or negative grams gracefully', () => {
    const result = calculateMyGoldValue(
      {
        grams: -5,
        karat: '21K',
        currency: 'SAR',
      },
      mockPricesData
    );

    expect(result.grams).toBe(0);
    expect(result.rawGoldTotal).toBe(0);
    expect(result.totalValue).toBe(0);
  });
});
