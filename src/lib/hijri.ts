/**
 * Pure TypeScript functions for Umm al-Qura Hijri Calendar calculations,
 * conversions, and Islamic events.
 */

export class HijriRangeError extends Error {
  constructor(year: number) {
    super(`Hijri year ${year} is outside the supported range (1343 - 1500 AH).`);
    this.name = 'HijriRangeError';
  }
}

export class InvalidHijriDateError extends Error {
  constructor(year: number, month: number, day: number, reason?: string) {
    super(`Invalid or impossible Hijri date: ${year}-${month}-${day}${reason ? ` (${reason})` : ''}.`);
    this.name = 'InvalidHijriDateError';
  }
}

export interface HijriDate {
  year: number;
  month: number;
  day: number;
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

export interface IslamicEvent {
  key: string;
  name: {
    ar: string;
    en: string;
  };
  hijriDay: number;
  hijriMonth: number;
  gregorianDate: Date;
  daysRemaining: number;
}

export interface HijriDayCell {
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  gregorianDate: Date;
  gregorianDay: number;
  gregorianMonth: number;
  weekday: number;
  isToday: boolean;
}

export const MIN_HIJRI_YEAR = 1343;
export const MAX_HIJRI_YEAR = 1500;

export const HIJRI_MONTH_NAMES_AR = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الآخر',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

export const HIJRI_MONTH_NAMES_EN = [
  'Muharram',
  'Safar',
  'Rabi al-Awwal',
  'Rabi al-Thani',
  'Jumada al-Ula',
  'Jumada al-Thaniyah',
  'Rajab',
  'Sha’ban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qi’dah',
  'Dhu al-Hijjah',
];

export const WEEKDAY_NAMES_AR = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

export const WEEKDAY_NAMES_EN = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const GREGORIAN_MONTH_NAMES_AR = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const GREGORIAN_MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Reference anchor: 1 Muharram 1446 = 7 July 2024
const BASE_UTC_TIME = Date.UTC(2024, 6, 7, 12, 0, 0);

const umalquraFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Converts a JavaScript Date to Umm al-Qura Hijri date parts.
 */
export function gregorianToHijri(date: Date): HijriDate {
  // Normalize to UTC noon to prevent timezone shifts across days
  const utcDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12, 0, 0)
  );
  const parts = umalquraFormatter.formatToParts(utcDate);

  let year = 0;
  let month = 0;
  let day = 0;

  for (const part of parts) {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'day') day = parseInt(part.value, 10);
  }

  const weekday = utcDate.getUTCDay();
  return { year, month, day, weekday };
}

/**
 * Returns the exact month length (29 or 30 days) for a given Hijri year and month.
 */
export function hijriMonthLength(year: number, month: number): number {
  if (year < MIN_HIJRI_YEAR || year > MAX_HIJRI_YEAR) {
    throw new HijriRangeError(year);
  }
  if (month < 1 || month > 12) {
    throw new InvalidHijriDateError(year, month, 1, 'Month must be between 1 and 12');
  }

  // Find day 1 of (year, month)
  const daysDiff = Math.round((year - 1446) * 354.367068 + (month - 1) * 29.530588);
  const estimate = new Date(BASE_UTC_TIME + daysDiff * 86400000);

  let day1Utc: Date | null = null;
  for (let offset = -40; offset <= 40; offset++) {
    const candidate = new Date(estimate.getTime() + offset * 86400000);
    const h = gregorianToHijri(candidate);
    if (h.year === year && h.month === month && h.day === 1) {
      day1Utc = candidate;
      break;
    }
  }

  if (!day1Utc) {
    throw new InvalidHijriDateError(year, month, 1, 'Could not resolve month starting date');
  }

  // Day 30 would be day1Utc + 29 days
  const day30Candidate = new Date(day1Utc.getTime() + 29 * 86400000);
  const h30 = gregorianToHijri(day30Candidate);
  return h30.year === year && h30.month === month && h30.day === 30 ? 30 : 29;
}

/**
 * Converts a Hijri date (year, month, day) to a Gregorian Date object.
 * Throws InvalidHijriDateError for impossible dates (e.g. day 30 in a 29-day month).
 */
export function hijriToGregorian(year: number, month: number, day: number): Date {
  if (year < MIN_HIJRI_YEAR || year > MAX_HIJRI_YEAR) {
    throw new HijriRangeError(year);
  }
  if (month < 1 || month > 12) {
    throw new InvalidHijriDateError(year, month, day, 'Month must be between 1 and 12');
  }
  if (day < 1 || day > 30) {
    throw new InvalidHijriDateError(year, month, day, 'Day must be between 1 and 30');
  }

  // Estimate the Gregorian date
  const daysDiff = Math.round(
    (year - 1446) * 354.367068 + (month - 1) * 29.530588 + (day - 1)
  );
  const estimate = new Date(BASE_UTC_TIME + daysDiff * 86400000);

  // Search stepping +/- 60 days
  let matched: Date | null = null;
  for (let offset = 0; offset <= 60; offset++) {
    const fwd = new Date(estimate.getTime() + offset * 86400000);
    const hF = gregorianToHijri(fwd);
    if (hF.year === year && hF.month === month && hF.day === day) {
      matched = fwd;
      break;
    }
    if (offset > 0) {
      const bwd = new Date(estimate.getTime() - offset * 86400000);
      const hB = gregorianToHijri(bwd);
      if (hB.year === year && hB.month === month && hB.day === day) {
        matched = bwd;
        break;
      }
    }
  }

  if (!matched) {
    throw new InvalidHijriDateError(
      year,
      month,
      day,
      `Day ${day} does not exist in month ${month} of year ${year} (month has 29 days)`
    );
  }

  return new Date(
    Date.UTC(matched.getUTCFullYear(), matched.getUTCMonth(), matched.getUTCDate())
  );
}

/**
 * Returns month name in Arabic or English
 */
export function getHijriMonthName(month: number, locale: 'ar' | 'en'): string {
  const index = Math.max(0, Math.min(11, month - 1));
  return locale === 'ar' ? HIJRI_MONTH_NAMES_AR[index] : HIJRI_MONTH_NAMES_EN[index];
}

/**
 * Returns weekday name in Arabic or English
 */
export function getWeekdayName(weekday: number, locale: 'ar' | 'en'): string {
  const index = Math.max(0, Math.min(6, weekday));
  return locale === 'ar' ? WEEKDAY_NAMES_AR[index] : WEEKDAY_NAMES_EN[index];
}

/**
 * Generates all day cells for a given Hijri month to display in a calendar grid.
 */
export function getMonthDaysGrid(
  year: number,
  month: number,
  todayReference?: Date
): HijriDayCell[] {
  const length = hijriMonthLength(year, month);
  const cells: HijriDayCell[] = [];
  const ref = todayReference || new Date();
  const todayHijri = gregorianToHijri(ref);

  for (let d = 1; d <= length; d++) {
    const gDate = hijriToGregorian(year, month, d);
    const isToday =
      todayHijri.year === year && todayHijri.month === month && todayHijri.day === d;

    cells.push({
      hijriDay: d,
      hijriMonth: month,
      hijriYear: year,
      gregorianDate: gDate,
      gregorianDay: gDate.getUTCDate(),
      gregorianMonth: gDate.getUTCMonth() + 1,
      weekday: gDate.getUTCDay(),
      isToday,
    });
  }

  return cells;
}

/**
 * Computes upcoming key Islamic dates and day countdowns from a reference date.
 */
export function getUpcomingIslamicEvents(referenceDate?: Date): IslamicEvent[] {
  const ref = referenceDate || new Date();
  const todayHijri = gregorianToHijri(ref);
  const currentY = todayHijri.year;

  // Key events:
  // 1. 1 Ramadan
  // 2. 1 Shawwal (Eid al-Fitr)
  // 3. 9 Dhu al-Hijjah (Day of Arafah)
  // 4. 10 Dhu al-Hijjah (Eid al-Adha)
  // 5. 1 Muharram (Islamic New Year)
  const targetEvents = [
    {
      key: 'ramadan',
      name: { ar: 'بداية شهر رمضان المبارك', en: '1st of Ramadan' },
      m: 9,
      d: 1,
    },
    {
      key: 'eid-fitr',
      name: { ar: 'عيد الفطر المبارك (1 شوال)', en: 'Eid al-Fitr (1 Shawwal)' },
      m: 10,
      d: 1,
    },
    {
      key: 'arafah',
      name: { ar: 'يوم عرفة (9 ذو الحجة)', en: 'Day of Arafah (9 Dhu al-Hijjah)' },
      m: 12,
      d: 9,
    },
    {
      key: 'eid-adha',
      name: { ar: 'عيد الأضحى المبارك (10 ذو الحجة)', en: 'Eid al-Adha (10 Dhu al-Hijjah)' },
      m: 12,
      d: 10,
    },
    {
      key: 'new-year',
      name: { ar: 'رأس السنة الهجرية (1 محرم)', en: 'Islamic New Year (1 Muharram)' },
      m: 1,
      d: 1,
    },
  ];

  const nowMs = Date.UTC(ref.getUTCFullYear(), ref.getUTCMonth(), ref.getUTCDate());

  const results: IslamicEvent[] = [];

  for (const evt of targetEvents) {
    // Try current year; if already passed, use next year
    let targetYear = currentY;
    let gDate = hijriToGregorian(targetYear, evt.m, evt.d);
    let targetMs = gDate.getTime();

    if (targetMs < nowMs) {
      targetYear = currentY + 1;
      gDate = hijriToGregorian(targetYear, evt.m, evt.d);
      targetMs = gDate.getTime();
    }

    const diffDays = Math.ceil((targetMs - nowMs) / 86400000);

    results.push({
      key: evt.key,
      name: evt.name,
      hijriDay: evt.d,
      hijriMonth: evt.m,
      gregorianDate: gDate,
      daysRemaining: Math.max(0, diffDays),
    });
  }

  // Sort by nearest upcoming event
  return results.sort((a, b) => a.daysRemaining - b.daysRemaining);
}
