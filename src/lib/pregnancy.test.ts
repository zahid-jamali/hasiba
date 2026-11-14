import { describe, it, expect } from 'vitest';
import {
  calculatePregnancy,
  PregnancyDateInFutureError,
  CycleLengthOutOfRangeError,
  InvalidPregnancyDateError,
} from './pregnancy';

describe('pregnancy calculator library', () => {
  // Fixed LMP date: May 1, 2025 (UTC noon)
  const lmpDate = new Date(Date.UTC(2025, 4, 1, 12, 0, 0)); // 2025-05-01

  describe('Standard Naegele’s Rule (280 days, 28-day cycle)', () => {
    it('calculates exact 280-day due date and 14-day conception date', () => {
      // 10 weeks later (70 days)
      const refDate = new Date(Date.UTC(2025, 6, 10, 12, 0, 0)); // 2025-07-10 (LMP + 70 days)

      const result = calculatePregnancy({
        mode: 'lmp',
        lmpDate,
        cycleLength: 28,
        referenceDate: refDate,
      });

      // Due date: May 1, 2025 + 280 days = February 5, 2026
      expect(result.dueDate.getUTCFullYear()).toBe(2026);
      expect(result.dueDate.getUTCMonth()).toBe(1); // February (0-indexed)
      expect(result.dueDate.getUTCDate()).toBe(5);

      // Conception date: May 1, 2025 + 14 days = May 15, 2025
      expect(result.conceptionDate.getUTCFullYear()).toBe(2025);
      expect(result.conceptionDate.getUTCMonth()).toBe(4); // May
      expect(result.conceptionDate.getUTCDate()).toBe(15);

      // Gestational age: 70 days = 10 weeks 0 days
      expect(result.totalDaysPregnancy).toBe(70);
      expect(result.currentWeek).toBe(10);
      expect(result.currentDayOfCurrentWeek).toBe(0);
      expect(result.trimester).toBe(1);

      // Remaining days: 280 - 70 = 210 days
      expect(result.daysRemaining).toBe(210);
      expect(result.isPastDue).toBe(false);
      expect(result.progressPercentage).toBe(25); // 70 / 280 = 25%
    });

    it('works when input is passed as year/month/day object', () => {
      const refDate = new Date(Date.UTC(2025, 6, 10, 12, 0, 0));
      const result = calculatePregnancy({
        mode: 'lmp',
        date: { year: 2025, month: 5, day: 1 },
        cycleLength: 28,
        referenceDate: refDate,
      });

      expect(result.dueDate.getUTCDate()).toBe(5);
      expect(result.dueDate.getUTCMonth()).toBe(1);
      expect(result.dueDate.getUTCFullYear()).toBe(2026);
    });
  });

  describe('Menstrual cycle variation adjustments', () => {
    it('adjusts due date by +4 days for a 32-day cycle', () => {
      const refDate = new Date(Date.UTC(2025, 6, 10, 12, 0, 0));

      const result = calculatePregnancy({
        mode: 'lmp',
        lmpDate,
        cycleLength: 32,
        referenceDate: refDate,
      });

      // Standard due date: Feb 5, 2026. With +4 days = Feb 9, 2026
      expect(result.dueDate.getUTCFullYear()).toBe(2026);
      expect(result.dueDate.getUTCMonth()).toBe(1); // February
      expect(result.dueDate.getUTCDate()).toBe(9);

      // Conception date: May 1 + 14 + (32 - 28) = May 19, 2025
      expect(result.conceptionDate.getUTCDate()).toBe(19);

      // Gestational age relative to equivalent LMP (May 5, 2025): 66 days = 9 weeks 3 days
      expect(result.totalDaysPregnancy).toBe(66);
      expect(result.currentWeek).toBe(9);
      expect(result.currentDayOfCurrentWeek).toBe(3);
    });

    it('adjusts due date by -4 days for a 24-day cycle', () => {
      const refDate = new Date(Date.UTC(2025, 6, 10, 12, 0, 0));

      const result = calculatePregnancy({
        mode: 'lmp',
        lmpDate,
        cycleLength: 24,
        referenceDate: refDate,
      });

      // Standard due date: Feb 5, 2026. With -4 days = Feb 1, 2026
      expect(result.dueDate.getUTCFullYear()).toBe(2026);
      expect(result.dueDate.getUTCMonth()).toBe(1); // February
      expect(result.dueDate.getUTCDate()).toBe(1);

      // Conception date: May 1 + 14 + (24 - 28) = May 11, 2025
      expect(result.conceptionDate.getUTCDate()).toBe(11);

      // Gestational age relative to equivalent LMP (April 27, 2025): 74 days = 10 weeks 4 days
      expect(result.totalDaysPregnancy).toBe(74);
      expect(result.currentWeek).toBe(10);
      expect(result.currentDayOfCurrentWeek).toBe(4);
    });

    it('enforces allowed cycle length bounds (21 to 35 days)', () => {
      // 21 days is valid
      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate,
          cycleLength: 21,
          referenceDate: lmpDate,
        })
      ).not.toThrow();

      // 35 days is valid
      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate,
          cycleLength: 35,
          referenceDate: lmpDate,
        })
      ).not.toThrow();

      // Below 21 throws error
      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate,
          cycleLength: 20,
          referenceDate: lmpDate,
        })
      ).toThrow(CycleLengthOutOfRangeError);

      // Above 35 throws error
      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate,
          cycleLength: 36,
          referenceDate: lmpDate,
        })
      ).toThrow(CycleLengthOutOfRangeError);
    });
  });

  describe('Conception Date Mode (266 days)', () => {
    it('calculates due date as conception date + 266 days with equivalent LMP', () => {
      // Conception date: May 15, 2025
      const conceptionDate = new Date(Date.UTC(2025, 4, 15, 12, 0, 0));
      // Reference date: 140 days after conception (20 weeks gestational age)
      const refDate = new Date(Date.UTC(2025, 9, 2, 12, 0, 0)); // Oct 2, 2025

      const result = calculatePregnancy({
        mode: 'conception',
        conceptionDate,
        referenceDate: refDate,
      });

      // Due date: May 15, 2025 + 266 days = February 5, 2026
      expect(result.dueDate.getUTCFullYear()).toBe(2026);
      expect(result.dueDate.getUTCMonth()).toBe(1);
      expect(result.dueDate.getUTCDate()).toBe(5);

      // Equivalent LMP = conception - 14 days = May 1, 2025
      expect(result.equivalentLmpDate.getUTCDate()).toBe(1);
      expect(result.equivalentLmpDate.getUTCMonth()).toBe(4);

      // Gestational age: Oct 2 - May 1 = 154 days = 22 weeks 0 days
      expect(result.totalDaysPregnancy).toBe(154);
      expect(result.currentWeek).toBe(22);
      expect(result.currentDayOfCurrentWeek).toBe(0);
      expect(result.trimester).toBe(2);
    });
  });

  describe('Trimester Categorizations', () => {
    it('categorizes Week 10 in 1st trimester', () => {
      // Day 70
      const ref = new Date(lmpDate.getTime() + 70 * 86400000);
      const res = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: ref });
      expect(res.currentWeek).toBe(10);
      expect(res.trimester).toBe(1);
      expect(res.trimesterName.en).toContain('1st Trimester');
    });

    it('categorizes Week 20 in 2nd trimester', () => {
      // Day 140
      const ref = new Date(lmpDate.getTime() + 140 * 86400000);
      const res = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: ref });
      expect(res.currentWeek).toBe(20);
      expect(res.trimester).toBe(2);
      expect(res.trimesterName.en).toContain('2nd Trimester');
    });

    it('categorizes Week 32 in 3rd trimester', () => {
      // Day 224
      const ref = new Date(lmpDate.getTime() + 224 * 86400000);
      const res = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: ref });
      expect(res.currentWeek).toBe(32);
      expect(res.trimester).toBe(3);
      expect(res.trimesterName.en).toContain('3rd Trimester');
    });
  });

  describe('Hijri due date conversion integration', () => {
    it('converts Gregorian due date to Umm al-Qura Hijri date properly', () => {
      const refDate = new Date(Date.UTC(2025, 4, 10, 12, 0, 0));
      const res = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: refDate });

      expect(res.hijriDueDate).toBeDefined();
      expect(res.hijriDueDate.year).toBeGreaterThanOrEqual(1447);
      expect(res.hijriDueDate.month).toBeGreaterThanOrEqual(1);
      expect(res.hijriDueDate.month).toBeLessThanOrEqual(12);
      expect(res.hijriDueDate.day).toBeGreaterThanOrEqual(1);
      expect(res.hijriDueDate.day).toBeLessThanOrEqual(30);
      expect(res.hijriDueDate.weekdayName.ar).toBeTruthy();
      expect(res.hijriDueDate.weekdayName.en).toBeTruthy();
      expect(res.hijriDueDate.monthName.ar).toBeTruthy();
      expect(res.hijriDueDate.formatted.ar).toContain('هـ');
      expect(res.hijriDueDate.formatted.en).toContain('AH');
    });

    it('supports Hijri input for LMP', () => {
      // 1 Dhu al-Qi'dah 1446 AH
      const res = calculatePregnancy({
        mode: 'lmp',
        date: { year: 1446, month: 11, day: 1 },
        calendarType: 'hijri',
        referenceDate: new Date(Date.UTC(2025, 6, 1, 12, 0, 0)),
      });

      expect(res.dueDate).toBeDefined();
      expect(res.hijriDueDate.year).toBeGreaterThanOrEqual(1447);
    });
  });

  describe('Milestones Timeline Verification', () => {
    it('generates 6 key pregnancy milestones with accurate dates and statuses', () => {
      // Set reference date to Week 20 (Anatomy Scan window)
      const refDate = new Date(lmpDate.getTime() + 140 * 86400000); // Day 140
      const res = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: refDate });

      expect(res.milestones).toHaveLength(6);

      const [implantation, firstTri, anatomy, viability, fullTerm, edd] = res.milestones;

      // Implantation (~Week 2-3) -> should be completed
      expect(implantation.id).toBe('implantation');
      expect(implantation.status).toBe('completed');

      // 1st trimester end (Week 13) -> completed
      expect(firstTri.id).toBe('first_trimester_end');
      expect(firstTri.status).toBe('completed');

      // Anatomy scan (Weeks 18-22) -> current at Week 20
      expect(anatomy.id).toBe('anatomy_scan');
      expect(anatomy.status).toBe('current');

      // Viability (Week 24) -> upcoming
      expect(viability.id).toBe('viability');
      expect(viability.status).toBe('upcoming');

      // Full term (Week 37) -> upcoming
      expect(fullTerm.id).toBe('full_term');
      expect(fullTerm.status).toBe('upcoming');

      // EDD (Week 40) -> upcoming
      expect(edd.id).toBe('due_date');
      expect(edd.status).toBe('upcoming');
    });
  });

  describe('Edge cases and error handling', () => {
    it('throws PregnancyDateInFutureError when reference date is earlier than LMP', () => {
      const pastRefDate = new Date(Date.UTC(2025, 3, 1, 12, 0, 0)); // April 1, 2025 (before May 1)

      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate,
          referenceDate: pastRefDate,
        })
      ).toThrow(PregnancyDateInFutureError);
    });

    it('throws PregnancyDateInFutureError when reference date is earlier than conception date', () => {
      const conceptionDate = new Date(Date.UTC(2025, 4, 15, 12, 0, 0));
      const pastRefDate = new Date(Date.UTC(2025, 4, 10, 12, 0, 0)); // 5 days prior

      expect(() =>
        calculatePregnancy({
          mode: 'conception',
          conceptionDate,
          referenceDate: pastRefDate,
        })
      ).toThrow(PregnancyDateInFutureError);
    });

    it('correctly flags past due date when gestational age exceeds 40 and 44 weeks', () => {
      // 41 weeks: 287 days
      const refDate41 = new Date(lmpDate.getTime() + 287 * 86400000);
      const res41 = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: refDate41 });

      expect(res41.isPastDue).toBe(true);
      expect(res41.daysPastDue).toBe(7);
      expect(res41.daysRemaining).toBe(0);
      expect(res41.isExceeding44Weeks).toBe(false);

      // 45 weeks: 315 days (exceeds 44 weeks)
      const refDate45 = new Date(lmpDate.getTime() + 315 * 86400000);
      const res45 = calculatePregnancy({ mode: 'lmp', lmpDate, referenceDate: refDate45 });

      expect(res45.isPastDue).toBe(true);
      expect(res45.daysPastDue).toBe(35);
      expect(res45.isExceeding44Weeks).toBe(true);
    });

    it('throws InvalidPregnancyDateError on missing dates or invalid input', () => {
      expect(() =>
        calculatePregnancy({
          mode: 'lmp',
          lmpDate: undefined,
        })
      ).toThrow(InvalidPregnancyDateError);

      expect(() =>
        calculatePregnancy({
          mode: 'conception',
          conceptionDate: undefined,
        })
      ).toThrow(InvalidPregnancyDateError);
    });
  });
});
