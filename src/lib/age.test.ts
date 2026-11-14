import { describe, it, expect } from 'vitest';
import {
  calculateAge,
  FutureDateError,
  InvalidDateInputError,
  isGregorianLeapYear,
} from './age';

describe('age calculator library', () => {
  const targetDate = new Date(Date.UTC(2025, 0, 1, 12, 0, 0)); // 2025-01-01

  describe('standard Gregorian and Hijri calculations', () => {
    it('calculates exact 25-year milestone correctly', () => {
      const res = calculateAge({
        calendarType: 'gregorian',
        birthYear: 2000,
        birthMonth: 1,
        birthDay: 1,
        targetDate,
      });

      expect(res.gregorianAge).toEqual({ years: 25, months: 0, days: 0 });
      expect(res.totalMonths).toBe(300);
      expect(res.totalDays).toBe(9132); // includes leap years 2000, 2004, 2008, 2012, 2016, 2020, 2024
      expect(res.approxHours).toBe(9132 * 24);
      expect(res.birthWeekday).toBe(6); // Saturday
      // Hijri age is higher than Gregorian age
      expect(res.hijriAge.years).toBeGreaterThanOrEqual(25);
    });

    it('calculates age when input is in Hijri', () => {
      const res = calculateAge({
        calendarType: 'hijri',
        birthYear: 1420,
        birthMonth: 9, // Ramadan 1420
        birthDay: 1,
        targetDate,
      });

      expect(res.hijriAge.years).toBeGreaterThan(0);
      expect(res.gregorianAge.years).toBeGreaterThan(0);
      expect(res.gregorianBirthDate).toBeDefined();
    });
  });

  describe('edge cases', () => {
    it('handles February 29 leap day births and adjusts in non-leap years', () => {
      // Born 29 Feb 2000
      const res = calculateAge({
        calendarType: 'gregorian',
        birthYear: 2000,
        birthMonth: 2,
        birthDay: 29,
        targetDate, // 1 Jan 2025 (2025 is not leap)
      });

      expect(res.gregorianAge.years).toBe(24);
      expect(res.nextGregorianBirthday.isAdjusted).toBe(true);
      expect(res.nextGregorianBirthday.adjustmentNote).toBeDefined();
      expect(res.nextGregorianBirthday.date.getUTCDate()).toBe(28); // uses 28 Feb
      expect(res.nextGregorianBirthday.date.getUTCMonth()).toBe(1); // Feb
    });

    it('handles end-of-month births (31st day)', () => {
      const res = calculateAge({
        calendarType: 'gregorian',
        birthYear: 1995,
        birthMonth: 1,
        birthDay: 31,
        targetDate: new Date(Date.UTC(2025, 1, 28, 12, 0, 0)), // 28 Feb 2025
      });

      expect(res.gregorianAge.years).toBe(30);
      expect(res.gregorianAge.months).toBe(0);
      expect(res.gregorianAge.days).toBe(28);
    });

    it('throws FutureDateError when birth date is in the future', () => {
      expect(() =>
        calculateAge({
          calendarType: 'gregorian',
          birthYear: 2026,
          birthMonth: 1,
          birthDay: 1,
          targetDate, // 2025-01-01
        })
      ).toThrow(FutureDateError);
    });

    it('handles birth date equal to today (0 years, 0 months, 0 days)', () => {
      const res = calculateAge({
        calendarType: 'gregorian',
        birthYear: 2025,
        birthMonth: 1,
        birthDay: 1,
        targetDate, // same day
      });

      expect(res.gregorianAge).toEqual({ years: 0, months: 0, days: 0 });
      expect(res.totalDays).toBe(0);
      expect(res.totalWeeks).toBe(0);
      expect(res.approxHours).toBe(0);
    });

    it('throws InvalidDateInputError for invalid dates', () => {
      expect(() =>
        calculateAge({
          calendarType: 'gregorian',
          birthYear: 2021,
          birthMonth: 2,
          birthDay: 30, // Feb 30 does not exist
          targetDate,
        })
      ).toThrow(InvalidDateInputError);
    });
  });

  describe('leap year utility', () => {
    it('identifies Gregorian leap years accurately', () => {
      expect(isGregorianLeapYear(2000)).toBe(true);
      expect(isGregorianLeapYear(2024)).toBe(true);
      expect(isGregorianLeapYear(1900)).toBe(false);
      expect(isGregorianLeapYear(2023)).toBe(false);
    });
  });
});
