/**
 * Pure TypeScript functions for age calculations in Gregorian and Hijri calendars,
 * lifetime milestones, and next birthday countdowns.
 */

import {
  gregorianToHijri,
  hijriToGregorian,
  hijriMonthLength,
  HijriDate,
} from './hijri';

export class FutureDateError extends Error {
  constructor() {
    super('Birth date cannot be in the future.');
    this.name = 'FutureDateError';
  }
}

export class InvalidDateInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDateInputError';
  }
}

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
}

export interface NextBirthdayInfo {
  date: Date;
  hijriDate: HijriDate;
  daysRemaining: number;
  weekday: number;
  isAdjusted: boolean;
  adjustmentNote?: {
    ar: string;
    en: string;
  };
}

export interface CalculateAgeOptions {
  calendarType: 'gregorian' | 'hijri';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  targetDate?: Date;
}

export interface AgeResult {
  gregorianAge: AgeBreakdown;
  hijriAge: AgeBreakdown;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  approxHours: number;
  gregorianBirthDate: Date;
  hijriBirthDate: HijriDate;
  birthWeekday: number;
  nextGregorianBirthday: NextBirthdayInfo;
  nextHijriBirthday: NextBirthdayInfo;
}

/**
 * Checks if a Gregorian year is a leap year.
 */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Calculates exact age in Gregorian years, months, and days.
 */
export function getExactGregorianDiff(
  bYear: number,
  bMonth: number,
  bDay: number,
  tYear: number,
  tMonth: number,
  tDay: number
): AgeBreakdown {
  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    months -= 1;
    // Number of days in the previous month of target date
    const prevMonthLastDay = new Date(Date.UTC(tYear, tMonth - 1, 0)).getUTCDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}

/**
 * Calculates exact age in Hijri years, months, and days.
 */
export function getExactHijriDiff(
  bYear: number,
  bMonth: number,
  bDay: number,
  tYear: number,
  tMonth: number,
  tDay: number
): AgeBreakdown {
  let years = tYear - bYear;
  let months = tMonth - bMonth;
  let days = tDay - bDay;

  if (days < 0) {
    months -= 1;
    let prevM = tMonth - 1;
    let prevY = tYear;
    if (prevM < 1) {
      prevM = 12;
      prevY -= 1;
    }
    const daysInPrev = hijriMonthLength(prevY, prevM);
    days += daysInPrev;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}

/**
 * Computes next Gregorian birthday countdown.
 */
export function calculateNextGregorianBirthday(
  bMonth: number,
  bDay: number,
  targetDate: Date
): NextBirthdayInfo {
  let y = targetDate.getUTCFullYear();
  const m = bMonth;
  const d = bDay;

  let effectiveD = d;
  let isAdjusted = false;
  if (m === 2 && d === 29 && !isGregorianLeapYear(y)) {
    effectiveD = 28;
    isAdjusted = true;
  }

  let nextBday = new Date(Date.UTC(y, m - 1, effectiveD, 12, 0, 0));
  const targetNoon = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      12,
      0,
      0
    )
  );

  if (nextBday.getTime() < targetNoon.getTime()) {
    y += 1;
    effectiveD = d;
    isAdjusted = false;
    if (m === 2 && d === 29 && !isGregorianLeapYear(y)) {
      effectiveD = 28;
      isAdjusted = true;
    }
    nextBday = new Date(Date.UTC(y, m - 1, effectiveD, 12, 0, 0));
  }

  const daysRemaining = Math.max(
    0,
    Math.round((nextBday.getTime() - targetNoon.getTime()) / 86400000)
  );

  return {
    date: nextBday,
    hijriDate: gregorianToHijri(nextBday),
    daysRemaining,
    weekday: nextBday.getUTCDay(),
    isAdjusted,
    adjustmentNote: isAdjusted
      ? {
          ar: 'تم اعتماد 28 فبراير بدلاً من 29 فبراير لكونها سنة غير كبيسة.',
          en: 'Using 28 February instead of 29 February as this is not a leap year.',
        }
      : undefined,
  };
}

/**
 * Computes next Hijri birthday countdown.
 */
export function calculateNextHijriBirthday(
  hMonth: number,
  hDay: number,
  targetDate: Date
): NextBirthdayInfo {
  const currentHijri = gregorianToHijri(targetDate);
  let y = currentHijri.year;

  let effectiveD = hDay;
  let isAdjusted = false;
  const monthLen = hijriMonthLength(y, hMonth);
  if (effectiveD > monthLen) {
    effectiveD = monthLen;
    isAdjusted = true;
  }

  let nextGDate = hijriToGregorian(y, hMonth, effectiveD);
  const targetNoon = new Date(
    Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      12,
      0,
      0
    )
  );

  if (nextGDate.getTime() < targetNoon.getTime()) {
    y += 1;
    effectiveD = hDay;
    isAdjusted = false;
    const nextMonthLen = hijriMonthLength(y, hMonth);
    if (effectiveD > nextMonthLen) {
      effectiveD = nextMonthLen;
      isAdjusted = true;
    }
    nextGDate = hijriToGregorian(y, hMonth, effectiveD);
  }

  const daysRemaining = Math.max(
    0,
    Math.round((nextGDate.getTime() - targetNoon.getTime()) / 86400000)
  );

  return {
    date: nextGDate,
    hijriDate: { year: y, month: hMonth, day: effectiveD, weekday: nextGDate.getUTCDay() },
    daysRemaining,
    weekday: nextGDate.getUTCDay(),
    isAdjusted,
    adjustmentNote: isAdjusted
      ? {
          ar: `تم اعتماد يوم ${effectiveD} لكون هذا الشهر الهجري 29 يوماً.`,
          en: `Using day ${effectiveD} as this Hijri month has 29 days.`,
        }
      : undefined,
  };
}

/**
 * Main age calculation function covering both calendars, lifetime statistics,
 * and upcoming birthday events.
 */
export function calculateAge(options: CalculateAgeOptions): AgeResult {
  const { calendarType, birthYear, birthMonth, birthDay, targetDate: rawTarget } = options;

  const targetDate = rawTarget
    ? new Date(Date.UTC(rawTarget.getUTCFullYear(), rawTarget.getUTCMonth(), rawTarget.getUTCDate(), 12, 0, 0))
    : new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate(), 12, 0, 0));

  let gBirthDate: Date;
  let hBirthDate: HijriDate;

  if (calendarType === 'gregorian') {
    if (birthMonth < 1 || birthMonth > 12) {
      throw new InvalidDateInputError('Invalid Gregorian month.');
    }
    const maxDay = new Date(Date.UTC(birthYear, birthMonth, 0)).getUTCDate();
    if (birthDay < 1 || birthDay > maxDay) {
      throw new InvalidDateInputError(`Invalid day ${birthDay} for month ${birthMonth} of year ${birthYear}.`);
    }

    gBirthDate = new Date(Date.UTC(birthYear, birthMonth - 1, birthDay, 12, 0, 0));
    hBirthDate = gregorianToHijri(gBirthDate);
  } else {
    // Hijri input
    const maxDay = hijriMonthLength(birthYear, birthMonth);
    if (birthDay < 1 || birthDay > maxDay) {
      throw new InvalidDateInputError(`Invalid day ${birthDay} for Hijri month ${birthMonth} of year ${birthYear}.`);
    }

    gBirthDate = hijriToGregorian(birthYear, birthMonth, birthDay);
    hBirthDate = {
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      weekday: gBirthDate.getUTCDay(),
    };
  }

  // Check if birth date is in the future
  if (gBirthDate.getTime() > targetDate.getTime()) {
    throw new FutureDateError();
  }

  // Gregorian exact breakdown
  const gregorianAge = getExactGregorianDiff(
    gBirthDate.getUTCFullYear(),
    gBirthDate.getUTCMonth() + 1,
    gBirthDate.getUTCDate(),
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate()
  );

  // Hijri exact breakdown
  const targetHijri = gregorianToHijri(targetDate);
  const hijriAge = getExactHijriDiff(
    hBirthDate.year,
    hBirthDate.month,
    hBirthDate.day,
    targetHijri.year,
    targetHijri.month,
    targetHijri.day
  );

  // Total time metrics
  const totalDays = Math.floor(
    (targetDate.getTime() - gBirthDate.getTime()) / 86400000
  );
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = gregorianAge.years * 12 + gregorianAge.months;
  const approxHours = totalDays * 24;

  // Next birthdays
  const nextGregorianBirthday = calculateNextGregorianBirthday(
    gBirthDate.getUTCMonth() + 1,
    gBirthDate.getUTCDate(),
    targetDate
  );

  const nextHijriBirthday = calculateNextHijriBirthday(
    hBirthDate.month,
    hBirthDate.day,
    targetDate
  );

  return {
    gregorianAge,
    hijriAge,
    totalMonths,
    totalWeeks,
    totalDays,
    approxHours,
    gregorianBirthDate: gBirthDate,
    hijriBirthDate: hBirthDate,
    birthWeekday: gBirthDate.getUTCDay(),
    nextGregorianBirthday,
    nextHijriBirthday,
  };
}
