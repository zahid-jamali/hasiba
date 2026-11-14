/**
 * Pure TypeScript calculation functions for pregnancy due dates,
 * gestational age, developmental trimesters, and clinical milestones.
 * Fully supports both Gregorian and Umm al-Qura Hijri calendars.
 */

import {
  gregorianToHijri,
  hijriToGregorian,
  HijriDate,
  getHijriMonthName,
  getWeekdayName,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
} from './hijri';

export class PregnancyDateInFutureError extends Error {
  constructor(message = 'Reference date cannot be earlier than LMP or conception date.') {
    super(message);
    this.name = 'PregnancyDateInFutureError';
  }
}

export class CycleLengthOutOfRangeError extends Error {
  constructor(cycleLength: number) {
    super(`Cycle length ${cycleLength} is outside the allowed range (21 - 35 days).`);
    this.name = 'CycleLengthOutOfRangeError';
  }
}

export class InvalidPregnancyDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidPregnancyDateError';
  }
}

export type PregnancyMode = 'lmp' | 'conception';
export type TrimesterNumber = 1 | 2 | 3;
export type MilestoneStatus = 'completed' | 'current' | 'upcoming';

export interface DateParts {
  year: number;
  month: number; // 1-12
  day: number;   // 1-31
}

export type PregnancyDateInput = Date | DateParts;

export interface PregnancyMilestone {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  targetWeek: number;
  weekRange: string;
  targetDate: Date;
  hijriDate: HijriDate;
  status: MilestoneStatus;
}

export interface FormattedDateInfo {
  date: Date;
  year: number;
  month: number;
  day: number;
  weekday: number;
  weekdayName: { ar: string; en: string };
  monthName: { ar: string; en: string };
  formatted: { ar: string; en: string };
}

export interface FormattedHijriDateInfo {
  hijri: HijriDate;
  year: number;
  month: number;
  day: number;
  weekday: number;
  weekdayName: { ar: string; en: string };
  monthName: { ar: string; en: string };
  formatted: { ar: string; en: string };
}

export interface PregnancyResult {
  mode: PregnancyMode;
  cycleLength: number;
  lmpDate: Date;
  conceptionDate: Date;
  equivalentLmpDate: Date;
  referenceDate: Date;
  dueDate: Date;
  gregorianDueDate: FormattedDateInfo;
  hijriDueDate: FormattedHijriDateInfo;
  totalDaysPregnancy: number;
  currentWeek: number;
  currentDayOfCurrentWeek: number;
  trimester: TrimesterNumber;
  trimesterName: { ar: string; en: string };
  daysRemaining: number;
  progressPercentage: number;
  isPastDue: boolean;
  daysPastDue: number;
  isExceeding44Weeks: boolean;
  milestones: PregnancyMilestone[];
}

export interface CalculatePregnancyOptions {
  mode: PregnancyMode;
  lmpDate?: PregnancyDateInput;
  conceptionDate?: PregnancyDateInput;
  date?: PregnancyDateInput;
  calendarType?: 'gregorian' | 'hijri';
  cycleLength?: number; // default 28, range 21-35
  referenceDate?: Date;
}

/**
 * Normalizes a Date or DateParts object to a clean UTC-noon Date.
 */
export function normalizeDateInput(
  input: PregnancyDateInput,
  calendarType: 'gregorian' | 'hijri' = 'gregorian'
): Date {
  if (input instanceof Date) {
    if (isNaN(input.getTime())) {
      throw new InvalidPregnancyDateError('Invalid date provided.');
    }
    // If it's already noon UTC, reuse UTC parts; otherwise convert local date parts to UTC noon
    return new Date(
      Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate(), 12, 0, 0)
    );
  }

  const { year, month, day } = input;
  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
    throw new InvalidPregnancyDateError('Year, month, and day must be valid numbers.');
  }

  if (calendarType === 'hijri') {
    const greg = hijriToGregorian(year, month, day);
    return new Date(
      Date.UTC(greg.getUTCFullYear(), greg.getUTCMonth(), greg.getUTCDate(), 12, 0, 0)
    );
  }

  if (month < 1 || month > 12) {
    throw new InvalidPregnancyDateError(`Gregorian month must be between 1 and 12, got ${month}.`);
  }
  const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > maxDay) {
    throw new InvalidPregnancyDateError(
      `Day ${day} is invalid for month ${month} of year ${year} (max days: ${maxDay}).`
    );
  }

  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/**
 * Formats Gregorian date info with Arabic and English day/month strings.
 */
export function formatGregorianDateInfo(date: Date): FormattedDateInfo {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const weekday = date.getUTCDay();

  const weekdayAr = getWeekdayName(weekday, 'ar');
  const weekdayEn = getWeekdayName(weekday, 'en');
  const monthAr = GREGORIAN_MONTH_NAMES_AR[month - 1];
  const monthEn = GREGORIAN_MONTH_NAMES_EN[month - 1];

  return {
    date,
    year,
    month,
    day,
    weekday,
    weekdayName: { ar: weekdayAr, en: weekdayEn },
    monthName: { ar: monthAr, en: monthEn },
    formatted: {
      ar: `${weekdayAr}، ${day} ${monthAr} ${year}م`,
      en: `${weekdayEn}, ${day} ${monthEn} ${year}`,
    },
  };
}

/**
 * Formats Umm al-Qura Hijri date info with Arabic and English day/month strings.
 */
export function formatHijriDateInfo(hijri: HijriDate): FormattedHijriDateInfo {
  const { year, month, day, weekday } = hijri;
  const weekdayAr = getWeekdayName(weekday, 'ar');
  const weekdayEn = getWeekdayName(weekday, 'en');
  const monthAr = getHijriMonthName(month, 'ar');
  const monthEn = getHijriMonthName(month, 'en');

  return {
    hijri,
    year,
    month,
    day,
    weekday,
    weekdayName: { ar: weekdayAr, en: weekdayEn },
    monthName: { ar: monthAr, en: monthEn },
    formatted: {
      ar: `${weekdayAr}، ${day} ${monthAr} ${year}هـ`,
      en: `${weekdayEn}, ${day} ${monthEn} ${year} AH`,
    },
  };
}

/**
 * Calculates milestone timelines given the equivalent LMP date and current gestational week.
 */
function buildMilestones(
  equivalentLmpDate: Date,
  currentWeek: number
): PregnancyMilestone[] {
  const configs: Array<{
    id: string;
    title: { ar: string; en: string };
    description: { ar: string; en: string };
    targetWeek: number;
    weekRange: string;
    targetDays: number;
    statusCheck: (week: number) => MilestoneStatus;
  }> = [
    {
      id: 'implantation',
      title: { ar: 'الإخصاب والانغراس في الرحم', en: 'Conception & Implantation' },
      description: {
        ar: 'تلقيح البويضة وانغراس الكيسة الأريمية في بطانة الرحم وبداية إفراز هرمون الحمل.',
        en: 'Fertilization and blastocyst implantation into the uterine wall.',
      },
      targetWeek: 2,
      weekRange: '2-3',
      targetDays: 14,
      statusCheck: (w) => (w < 2 ? 'upcoming' : w <= 3 ? 'current' : 'completed'),
    },
    {
      id: 'first_trimester_end',
      title: { ar: 'نهاية الثلث الأول', en: 'End of 1st Trimester' },
      description: {
        ar: 'اكتمال تكوّن الأعضاء الحيوية وبدء استقرار الحمل وتراجع أعراض الغثيان الصباحي.',
        en: 'Major vital organogenesis complete; morning sickness commonly subsides.',
      },
      targetWeek: 13,
      weekRange: '13',
      targetDays: 91, // 13 * 7
      statusCheck: (w) => (w < 13 ? 'upcoming' : w === 13 ? 'current' : 'completed'),
    },
    {
      id: 'anatomy_scan',
      title: { ar: 'فحص السونار التفصيلي (تشوهات الأجنة)', en: 'Anatomy Ultrasound Scan' },
      description: {
        ar: 'فحص تفصيلي شامل لتقييم سلامة وتكوين أعضاء الجنين وتحديد الجنس بدقة.',
        en: 'Comprehensive mid-pregnancy ultrasound assessing fetal anatomy and development.',
      },
      targetWeek: 20,
      weekRange: '18-22',
      targetDays: 140, // 20 * 7
      statusCheck: (w) => (w < 18 ? 'upcoming' : w <= 22 ? 'current' : 'completed'),
    },
    {
      id: 'viability',
      title: { ar: 'مرحلة قابلية الجنين للحياة (Viability)', en: 'Fetal Viability Milestone' },
      description: {
        ar: 'اكتمال نمو الحويصلات الهوائية وإمكانية نجاة الجنين برعاية العناية المركزة لحديثي الولادة.',
        en: 'Fetal viability achieved; potential survival outside the womb with intensive neonatal care.',
      },
      targetWeek: 24,
      weekRange: '24',
      targetDays: 168, // 24 * 7
      statusCheck: (w) => (w < 24 ? 'upcoming' : w === 24 ? 'current' : 'completed'),
    },
    {
      id: 'full_term',
      title: { ar: 'اكتمال نمو الجنين (تمام الحمل)', en: 'Full Term Reached' },
      description: {
        ar: 'اكتمال نمو الرئتين وزيادة مخزون الدهون، والجنين جاهز سريرياً للولادة الطبيعية الآمنة.',
        en: 'Fetal lungs mature; considered medically full-term for safe labor and delivery.',
      },
      targetWeek: 37,
      weekRange: '37-39',
      targetDays: 259, // 37 * 7
      statusCheck: (w) => (w < 37 ? 'upcoming' : w < 40 ? 'current' : 'completed'),
    },
    {
      id: 'due_date',
      title: { ar: 'موعد الولادة المتوقع (الأسبوع 40)', en: 'Estimated Due Date' },
      description: {
        ar: 'إتمام 280 يوماً من الحمل، وهو التاريخ المرجعي الإحصائي لاكتمال فترة الحمل.',
        en: 'Completion of 280 gestational days; clinical benchmark date for delivery.',
      },
      targetWeek: 40,
      weekRange: '40',
      targetDays: 280,
      statusCheck: (w) => (w < 40 ? 'upcoming' : w === 40 ? 'current' : 'completed'),
    },
  ];

  return configs.map((c) => {
    const targetDate = new Date(equivalentLmpDate.getTime() + c.targetDays * 86400000);
    const hijriDate = gregorianToHijri(targetDate);
    return {
      id: c.id,
      title: c.title,
      description: c.description,
      targetWeek: c.targetWeek,
      weekRange: c.weekRange,
      targetDate,
      hijriDate,
      status: c.statusCheck(currentWeek),
    };
  });
}

/**
 * Main clinical pregnancy calculator function.
 * Implements Naegele's rule with cycle variation adjustments and conception-date mode.
 */
export function calculatePregnancy(options: CalculatePregnancyOptions): PregnancyResult {
  const { mode, calendarType = 'gregorian', cycleLength = 28, referenceDate: rawRef } = options;

  if (cycleLength < 21 || cycleLength > 35) {
    throw new CycleLengthOutOfRangeError(cycleLength);
  }

  // Determine reference date (defaults to today normalized to noon UTC)
  const now = rawRef || new Date();
  const referenceDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0)
  );

  let rawLmpDate: Date | null = null;
  let rawConceptionDate: Date | null = null;
  let equivalentLmpDate: Date;
  let dueDate: Date;
  let conceptionDate: Date;

  if (mode === 'lmp') {
    const inputDate = options.lmpDate || options.date;
    if (!inputDate) {
      throw new InvalidPregnancyDateError('LMP date is required for LMP mode.');
    }

    rawLmpDate = normalizeDateInput(inputDate, calendarType);

    // Validation: referenceDate must not be before LMP date
    if (referenceDate.getTime() < rawLmpDate.getTime()) {
      throw new PregnancyDateInFutureError(
        'Reference date cannot be earlier than the Last Menstrual Period (LMP) date.'
      );
    }

    // Due date = LMP + 280 days + (cycleLength - 28) days
    const cycleAdjustmentDays = cycleLength - 28;
    dueDate = new Date(rawLmpDate.getTime() + (280 + cycleAdjustmentDays) * 86400000);

    // Conception date estimation = LMP + 14 days + (cycleLength - 28) days
    conceptionDate = new Date(rawLmpDate.getTime() + (14 + cycleAdjustmentDays) * 86400000);

    // Equivalent LMP = conceptionDate - 14 days = rawLmpDate + cycleAdjustmentDays
    equivalentLmpDate = new Date(conceptionDate.getTime() - 14 * 86400000);
  } else if (mode === 'conception') {
    const inputDate = options.conceptionDate || options.date;
    if (!inputDate) {
      throw new InvalidPregnancyDateError('Conception date is required for conception mode.');
    }

    rawConceptionDate = normalizeDateInput(inputDate, calendarType);

    // Validation: referenceDate must not be before conception date
    if (referenceDate.getTime() < rawConceptionDate.getTime()) {
      throw new PregnancyDateInFutureError(
        'Reference date cannot be earlier than the conception date.'
      );
    }

    conceptionDate = rawConceptionDate;
    // Due date = conceptionDate + 266 days
    dueDate = new Date(conceptionDate.getTime() + 266 * 86400000);

    // Equivalent LMP = conceptionDate - 14 days
    equivalentLmpDate = new Date(conceptionDate.getTime() - 14 * 86400000);
  } else {
    throw new InvalidPregnancyDateError(`Unsupported pregnancy mode: ${mode}`);
  }

  // Gestational age computation relative to reference date
  const rawDays = Math.round(
    (referenceDate.getTime() - equivalentLmpDate.getTime()) / 86400000
  );
  const totalDaysPregnancy = Math.max(0, rawDays);

  const currentWeek = Math.floor(totalDaysPregnancy / 7);
  const currentDayOfCurrentWeek = totalDaysPregnancy % 7;

  // Trimester classification:
  // 1st trimester: weeks 1 to 13 (inclusive)
  // 2nd trimester: weeks 14 to 27 (inclusive)
  // 3rd trimester: weeks 28 to 40+
  let trimester: TrimesterNumber = 1;
  if (currentWeek >= 28) {
    trimester = 3;
  } else if (currentWeek >= 14) {
    trimester = 2;
  } else {
    trimester = 1;
  }

  const trimesterName = {
    1: { ar: 'الثلث الأول (الأسابيع 1-13)', en: '1st Trimester (Weeks 1-13)' },
    2: { ar: 'الثلث الثاني (الأسابيع 14-27)', en: '2nd Trimester (Weeks 14-27)' },
    3: { ar: 'الثلث الثالث (الأسابيع 28-40+)', en: '3rd Trimester (Weeks 28-40+)' },
  }[trimester];

  // Days remaining until due date
  const diffToDue = Math.round((dueDate.getTime() - referenceDate.getTime()) / 86400000);
  const daysRemaining = Math.max(0, diffToDue);
  const isPastDue = diffToDue < 0;
  const daysPastDue = isPastDue ? Math.abs(diffToDue) : 0;
  const isExceeding44Weeks = currentWeek >= 44;

  // Percentage of 280-day pregnancy completed
  const progressPercentage = Math.min(
    100,
    Math.max(0, Math.round((totalDaysPregnancy / 280) * 100))
  );

  // Formatted due dates
  const gregorianDueDate = formatGregorianDateInfo(dueDate);
  const hijriDueDate = formatHijriDateInfo(gregorianToHijri(dueDate));

  // Milestone timeline
  const milestones = buildMilestones(equivalentLmpDate, currentWeek);

  return {
    mode,
    cycleLength,
    lmpDate: rawLmpDate || equivalentLmpDate,
    conceptionDate,
    equivalentLmpDate,
    referenceDate,
    dueDate,
    gregorianDueDate,
    hijriDueDate,
    totalDaysPregnancy,
    currentWeek,
    currentDayOfCurrentWeek,
    trimester,
    trimesterName,
    daysRemaining,
    progressPercentage,
    isPastDue,
    daysPastDue,
    isExceeding44Weeks,
    milestones,
  };
}
