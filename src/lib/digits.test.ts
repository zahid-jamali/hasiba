import { describe, it, expect } from 'vitest';
import {
  toWesternDigits,
  toArabicDigits,
  normalizeNumberInput,
  parseLocalizedNumber,
} from './digits';

describe('digits helper', () => {
  describe('toWesternDigits', () => {
    it('converts Arabic-Indic digits (٠-٩) correctly', () => {
      expect(toWesternDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
      expect(toWesternDigits('١٤٤٦')).toBe('1446');
      expect(toWesternDigits('٢٠٢٥')).toBe('2025');
    });

    it('converts Persian digits (۰-۹) correctly', () => {
      expect(toWesternDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789');
      expect(toWesternDigits('۱۴۰۳')).toBe('1403');
      expect(toWesternDigits('۴۵۶')).toBe('456');
    });

    it('handles mixed Arabic-Indic and Persian digits', () => {
      expect(toWesternDigits('١۲۳۴٥')).toBe('12345');
    });

    it('preserves existing Western digits and non-digit characters', () => {
      expect(toWesternDigits('123')).toBe('123');
      expect(toWesternDigits('التاريخ: ١٥ رمضان ١٤٤٦')).toBe('التاريخ: 15 رمضان 1446');
      expect(toWesternDigits('Year: ۲۰۲۴ / 1445')).toBe('Year: 2024 / 1445');
    });

    it('handles empty and whitespace strings gracefully', () => {
      expect(toWesternDigits('')).toBe('');
      expect(toWesternDigits('   ')).toBe('   ');
    });
  });

  describe('toArabicDigits', () => {
    it('converts Western numbers to Arabic-Indic digits', () => {
      expect(toArabicDigits('0123456789')).toBe('٠١٢٣٤٥٦٧٨٩');
      expect(toArabicDigits(2025)).toBe('٢٠٢٥');
      expect(toArabicDigits(1446)).toBe('١٤٤٦');
    });

    it('handles negative numbers and decimals', () => {
      expect(toArabicDigits('-25.5')).toBe('-٢٥.٥');
    });
  });

  describe('normalizeNumberInput', () => {
    it('converts Arabic-Indic digits and Arabic decimal separator', () => {
      expect(normalizeNumberInput('١٢٣٫٤٥')).toBe('123.45');
      expect(normalizeNumberInput('۱٬۲۳۴٫۵۶')).toBe('1234.56');
    });

    it('removes comma separators', () => {
      expect(normalizeNumberInput('1,000,000')).toBe('1000000');
      expect(normalizeNumberInput('١٬٠٠٠٬٠٠٠٫٥٠')).toBe('1000000.50');
    });
  });

  describe('parseLocalizedNumber', () => {
    it('parses Eastern digit numbers to JS numbers', () => {
      expect(parseLocalizedNumber('١٢٣')).toBe(123);
      expect(parseLocalizedNumber('۴۵٫۵')).toBe(45.5);
      expect(parseLocalizedNumber('١٬٠٠٠')).toBe(1000);
    });

    it('returns NaN for invalid number inputs', () => {
      expect(Number.isNaN(parseLocalizedNumber('abc'))).toBe(true);
      expect(Number.isNaN(parseLocalizedNumber(''))).toBe(true);
    });
  });
});
