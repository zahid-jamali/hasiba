import { describe, it, expect } from 'vitest';
import {
  gregorianToHijri,
  hijriToGregorian,
  hijriMonthLength,
  HijriRangeError,
  InvalidHijriDateError,
  getHijriMonthName,
  getWeekdayName,
  getUpcomingIslamicEvents,
} from './hijri';

describe('hijri calendar library (Umm al-Qura standard)', () => {
  describe('known historical test pairs', () => {
    it('1 Muharram 1446 AH matches 7 July 2024 CE', () => {
      // 1 Muharram 1446 = 7 July 2024
      const gDate = new Date(Date.UTC(2024, 6, 7)); // July is month 6 (0-indexed)
      const h = gregorianToHijri(gDate);
      expect(h.year).toBe(1446);
      expect(h.month).toBe(1);
      expect(h.day).toBe(1);

      const convertedG = hijriToGregorian(1446, 1, 1);
      expect(convertedG.getUTCFullYear()).toBe(2024);
      expect(convertedG.getUTCMonth()).toBe(6); // July
      expect(convertedG.getUTCDate()).toBe(7);
    });

    it('1 Shawwal 1445 AH (Eid al-Fitr) matches 10 April 2024 CE', () => {
      // 1 Shawwal 1445 = 10 April 2024
      const gDate = new Date(Date.UTC(2024, 3, 10)); // April is month 3
      const h = gregorianToHijri(gDate);
      expect(h.year).toBe(1445);
      expect(h.month).toBe(10);
      expect(h.day).toBe(1);

      const convertedG = hijriToGregorian(1445, 10, 1);
      expect(convertedG.getUTCFullYear()).toBe(2024);
      expect(convertedG.getUTCMonth()).toBe(3); // April
      expect(convertedG.getUTCDate()).toBe(10);
    });
  });

  describe('month length and validation', () => {
    it('accurately identifies 29 and 30 day months', () => {
      // Ramadan 1445 in Umm al-Qura was 30 days
      expect(hijriMonthLength(1445, 9)).toBe(30);
      // Shawwal 1445 in Umm al-Qura was 29 days
      expect(hijriMonthLength(1445, 10)).toBe(29);
      // Muharram 1446 was 29 days
      expect(hijriMonthLength(1446, 1)).toBe(29);
    });

    it('throws InvalidHijriDateError for impossible day in a 29-day month', () => {
      // Day 30 in a 29-day month must throw
      expect(() => hijriToGregorian(1446, 1, 30)).toThrow(InvalidHijriDateError);
      expect(() => hijriToGregorian(1445, 10, 30)).toThrow(InvalidHijriDateError);
    });

    it('throws HijriRangeError for years outside 1343 - 1500 AH', () => {
      expect(() => hijriToGregorian(1342, 1, 1)).toThrow(HijriRangeError);
      expect(() => hijriToGregorian(1501, 1, 1)).toThrow(HijriRangeError);
      expect(() => hijriMonthLength(1300, 1)).toThrow(HijriRangeError);
    });
  });

  describe('comprehensive round-trip across 1440 - 1460 AH', () => {
    it('round-trips every valid day of 1440-1460 AH without error', () => {
      // Full round-trip testing 1440 to 1460
      for (let y = 1440; y <= 1460; y++) {
        for (let m = 1; m <= 12; m++) {
          const monthLen = hijriMonthLength(y, m);
          expect(monthLen).toBeGreaterThanOrEqual(29);
          expect(monthLen).toBeLessThanOrEqual(30);

          for (let d = 1; d <= monthLen; d++) {
            const g = hijriToGregorian(y, m, d);
            const back = gregorianToHijri(g);
            expect(back.year).toBe(y);
            expect(back.month).toBe(m);
            expect(back.day).toBe(d);
          }
        }
      }
    });
  });

  describe('month and weekday helpers', () => {
    it('returns correct localized month names', () => {
      expect(getHijriMonthName(1, 'ar')).toBe('محرم');
      expect(getHijriMonthName(9, 'ar')).toBe('رمضان');
      expect(getHijriMonthName(1, 'en')).toBe('Muharram');
      expect(getHijriMonthName(9, 'en')).toBe('Ramadan');
    });

    it('returns correct localized weekday names', () => {
      expect(getWeekdayName(0, 'ar')).toBe('الأحد');
      expect(getWeekdayName(5, 'ar')).toBe('الجمعة');
      expect(getWeekdayName(0, 'en')).toBe('Sunday');
      expect(getWeekdayName(5, 'en')).toBe('Friday');
    });
  });

  describe('upcoming Islamic dates', () => {
    it('computes positive countdowns for upcoming Islamic events', () => {
      const events = getUpcomingIslamicEvents(new Date(Date.UTC(2025, 0, 1)));
      expect(events.length).toBe(5);
      for (const evt of events) {
        expect(evt.daysRemaining).toBeGreaterThanOrEqual(0);
        expect(evt.name.ar).toBeDefined();
        expect(evt.name.en).toBeDefined();
      }
    });
  });
});
