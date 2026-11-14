/**
 * src/lib/edge-cases.test.ts
 * Rigorous edge-case and robustness tests for all calculators:
 * - Arabic-Indic and Persian digits
 * - Empty fields
 * - Negative inputs
 * - Extreme and invalid dates
 */

import { describe, it, expect } from 'vitest';
import { parseLocalizedNumber } from './digits';
import { calculateAge } from './age';
import { hijriToGregorian, HijriRangeError, InvalidHijriDateError } from './hijri';
import { calculateMyGoldValue } from './gold';
import { calculateZakat } from './zakat';
import { calculateUaeGratuity } from './gratuity-uae';
import { calculateSaudiGratuity } from './gratuity-ksa';
import { calculatePregnancy } from './pregnancy';

const mockPricesData = {
  updatedAt: new Date().toISOString(),
  xauUsdOz: 2685.4,
  xagUsdOz: 31.42,
  fx: {
    SAR: 3.75,
    AED: 3.6725,
    EGP: 53.437,
    KWD: 0.3113,
    QAR: 3.64,
    JOD: 0.709,
    IQD: 1514.2712,
    OMR: 0.3845,
    BHD: 0.376,
    MAD: 9.8884,
  },
};

describe('Full Robustness & Edge-Cases QA', () => {
  describe('1. Eastern Digits (Arabic-Indic & Persian)', () => {
    it('parses salary entered in Arabic-Indic digits', () => {
      const parsedSalary = parseLocalizedNumber('١٢٥٠٠');
      expect(parsedSalary).toBe(12500);

      const uaeResult = calculateUaeGratuity({
        basicSalaryMonthly: parsedSalary,
        startDate: '2020-01-01',
        endDate: '2023-01-01',
      });
      expect(uaeResult.finalGratuityPayable).toBeGreaterThan(0);
      expect(isNaN(uaeResult.finalGratuityPayable)).toBe(false);
    });

    it('parses gold grams in Arabic-Indic digits', () => {
      const gramsParsed = parseLocalizedNumber('٥٠٫٥');
      expect(gramsParsed).toBe(50.5);

      const result = calculateMyGoldValue(
        {
          grams: gramsParsed,
          karat: '21K',
          currency: 'SAR',
        },
        mockPricesData
      );
      expect(result.totalValue).toBeGreaterThan(0);
      expect(isNaN(result.totalValue)).toBe(false);
    });

    it('parses zakat cash in Arabic-Indic digits', () => {
      const cashParsed = parseLocalizedNumber('١٠٠٠٠٠');
      expect(cashParsed).toBe(100000);

      const zakatResult = calculateZakat(
        {
          cashAtHome: cashParsed,
          selectedCurrency: 'SAR',
        },
        mockPricesData
      );
      expect(zakatResult.zakatDue).toBe(2500);
      expect(isNaN(zakatResult.zakatDue)).toBe(false);
    });
  });

  describe('2. Empty, Zero, and Negative Inputs', () => {
    it('handles zero or negative grams gracefully without NaN or negative values', () => {
      const zeroVal = calculateMyGoldValue(
        { grams: 0, karat: '24K', currency: 'SAR' },
        mockPricesData
      );
      expect(zeroVal.totalValue).toBe(0);

      const negVal = calculateMyGoldValue(
        { grams: -25, karat: '24K', currency: 'SAR' },
        mockPricesData
      );
      expect(negVal.totalValue).toBe(0);
    });

    it('handles empty/zero zakat assets without crashing or NaN', () => {
      const result = calculateZakat(
        {
          selectedCurrency: 'SAR',
        },
        mockPricesData
      );
      expect(result.totalAssets).toBe(0);
      expect(result.netZakatableWealth).toBe(0);
      expect(result.zakatDue).toBe(0);
      expect(result.isNisabReached).toBe(false);
    });

    it('handles deductions exceeding assets in Zakat (net zakatable should be 0, not negative)', () => {
      const result = calculateZakat(
        {
          cashAtHome: 10000,
          debtsDueNow: 25000,
          selectedCurrency: 'SAR',
        },
        mockPricesData
      );
      expect(result.totalAssets).toBe(10000);
      expect(result.totalDeductions).toBe(25000);
      expect(result.netZakatableWealth).toBe(0);
      expect(result.zakatDue).toBe(0);
    });

    it('clamps UAE gratuity with deductions exceeding total to 0, never negative', () => {
      const result = calculateUaeGratuity({
        basicSalaryMonthly: 5000,
        startDate: '2022-01-01',
        endDate: '2024-01-01',
        employerDeductions: 999999,
      });
      expect(result.finalGratuityPayable).toBe(0);
    });

    it('clamps Saudi gratuity with deductions exceeding total to 0, never negative', () => {
      const result = calculateSaudiGratuity({
        contractWageMonthly: 5000,
        startDate: '2020-01-01',
        endDate: '2023-01-01',
        separationReason: 'termination_or_end',
        employerDeductions: 999999,
      });
      expect(result.finalGratuityPayable).toBe(0);
    });
  });

  describe('3. Extreme and Out-of-Range Dates', () => {
    it('throws friendly HijriRangeError for Hijri years outside 1343-1500 AH', () => {
      expect(() => hijriToGregorian(1300, 1, 1)).toThrow(HijriRangeError);
      expect(() => hijriToGregorian(1550, 1, 1)).toThrow(HijriRangeError);
    });

    it('throws friendly InvalidHijriDateError for impossible day of month (e.g. day 31)', () => {
      expect(() => hijriToGregorian(1446, 1, 31)).toThrow(InvalidHijriDateError);
    });

    it('throws friendly error when birth date is in the future in Age Calculator', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 2);

      expect(() =>
        calculateAge({
          calendarType: 'gregorian',
          birthYear: future.getFullYear(),
          birthMonth: 1,
          birthDay: 1,
        })
      ).toThrow();
    });

    it('throws friendly error for future pregnancy LMP date', () => {
      const futureLmp = new Date();
      futureLmp.setDate(futureLmp.getDate() + 30);

      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate: futureLmp,
        })
      ).toThrow();
    });

    it('gracefully handles 29 February leap-year birthdays on non-leap target years', () => {
      const result = calculateAge({
        calendarType: 'gregorian',
        birthYear: 2000,
        birthMonth: 2,
        birthDay: 29,
        targetDate: new Date(Date.UTC(2023, 2, 1)), // 1 March 2023 (non-leap year)
      });
      expect(result.gregorianAge.years).toBe(23);
      expect(isNaN(result.totalDays)).toBe(false);
    });
  });
});
