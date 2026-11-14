'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@/i18n/types';
import {
  calculateAge,
  AgeResult,
} from '@/lib/age';
import {
  getHijriMonthName,
  getWeekdayName,
  HIJRI_MONTH_NAMES_AR,
  HIJRI_MONTH_NAMES_EN,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
  hijriMonthLength,
  MIN_HIJRI_YEAR,
  MAX_HIJRI_YEAR,
} from '@/lib/hijri';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import { Select } from '@/components/ui/Select';
import { ResultBox } from '@/components/ui/ResultBox';
import { useDigits } from '@/context/DigitsContext';

interface AgeCalculatorProps {
  locale: Locale;
  initialBirthYear?: number;
  initialBirthMonth?: number;
}

export const AgeCalculator: React.FC<AgeCalculatorProps> = ({
  locale,
  initialBirthYear = 1995,
  initialBirthMonth = 1,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';

  const [calendarMode, setCalendarMode] = useState<'gregorian' | 'hijri'>('gregorian');

  // Gregorian inputs
  const [gDay, setGDay] = useState(1);
  const [gMonth, setGMonth] = useState(initialBirthMonth);
  const [gYear, setGYear] = useState(initialBirthYear);

  // Hijri inputs
  const [hDay, setHDay] = useState(1);
  const [hMonth, setHMonth] = useState(1);
  const [hYear, setHYear] = useState(1415);

  // Optional "calculate age on" target date (default today)
  const [useCustomTargetDate, setUseCustomTargetDate] = useState(false);
  const now = new Date();
  const [targetYear, setTargetYear] = useState(now.getFullYear());
  const [targetMonth, setTargetMonth] = useState(now.getMonth() + 1);
  const [targetDay, setTargetDay] = useState(now.getDate());

  // Dynamic day limits
  const maxGDay = useMemo(() => {
    return new Date(Date.UTC(gYear, gMonth, 0)).getUTCDate();
  }, [gYear, gMonth]);

  const maxHDay = useMemo(() => {
    try {
      return hijriMonthLength(hYear, hMonth);
    } catch {
      return 30;
    }
  }, [hYear, hMonth]);

  const validGDay = Math.min(gDay, maxGDay);
  const validHDay = Math.min(hDay, maxHDay);

  const ageCalculation = useMemo(() => {
    try {
      const target = useCustomTargetDate
        ? new Date(Date.UTC(targetYear, targetMonth - 1, targetDay, 12, 0, 0))
        : new Date();

      const result: AgeResult = calculateAge({
        calendarType: calendarMode,
        birthYear: calendarMode === 'gregorian' ? gYear : hYear,
        birthMonth: calendarMode === 'gregorian' ? gMonth : hMonth,
        birthDay: calendarMode === 'gregorian' ? validGDay : validHDay,
        targetDate: target,
      });

      return { result, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid date input.';
      return { result: null, error: msg };
    }
  }, [
    calendarMode,
    gYear,
    gMonth,
    validGDay,
    hYear,
    hMonth,
    validHDay,
    useCustomTargetDate,
    targetYear,
    targetMonth,
    targetDay,
  ]);

  const { result, error } = ageCalculation;

  // Format result display
  let primaryDisplay = '';
  let shareText = '';
  let nextBdayDisplay = '';
  let otherCalendarBirthDisplay = '';
  let birthWeekdayDisplay = '';

  if (result) {
    const gYears = result.gregorianAge.years;
    const gMonths = result.gregorianAge.months;
    const gDays = result.gregorianAge.days;

    const hYears = result.hijriAge.years;
    const hMonths = result.hijriAge.months;
    const hDays = result.hijriAge.days;

    primaryDisplay = isAr
      ? `${formatDigits(gYears)} سنة، ${formatDigits(gMonths)} شهر، ${formatDigits(gDays)} يوم`
      : `${formatDigits(gYears)} yrs, ${formatDigits(gMonths)} mos, ${formatDigits(gDays)} days`;

    const hijriFullStr = isAr
      ? `${formatDigits(hYears)} سنة، ${formatDigits(hMonths)} شهر، ${formatDigits(hDays)} يوم`
      : `${formatDigits(hYears)} yrs, ${formatDigits(hMonths)} mos, ${formatDigits(hDays)} days`;

    birthWeekdayDisplay = getWeekdayName(result.birthWeekday, locale);

    if (calendarMode === 'gregorian') {
      const hMonthName = getHijriMonthName(result.hijriBirthDate.month, locale);
      otherCalendarBirthDisplay = `${formatDigits(result.hijriBirthDate.day)} ${hMonthName} ${formatDigits(result.hijriBirthDate.year)} ${isAr ? 'هـ' : 'AH'}`;
    } else {
      const gM = result.gregorianBirthDate.getUTCMonth();
      const gMName = isAr ? GREGORIAN_MONTH_NAMES_AR[gM] : GREGORIAN_MONTH_NAMES_EN[gM];
      otherCalendarBirthDisplay = `${formatDigits(result.gregorianBirthDate.getUTCDate())} ${gMName} ${formatDigits(result.gregorianBirthDate.getUTCFullYear())} ${isAr ? 'م' : 'CE'}`;
    }

    const nextGDay = result.nextGregorianBirthday.daysRemaining;
    const nextGWeekday = getWeekdayName(result.nextGregorianBirthday.weekday, locale);
    nextBdayDisplay = isAr
      ? `بعد ${formatDigits(nextGDay)} يوماً (يوم ${nextGWeekday})`
      : `In ${formatDigits(nextGDay)} days (${nextGWeekday})`;

    shareText = isAr
      ? `حساب عمري بدقة عبر حاسبة:\n- عمري بالميلادي: ${primaryDisplay}\n- عمري بالهجري: ${hijriFullStr}\n- إجمالي الأيام التي عشتها: ${formatDigits(result.totalDays)} يوماً\nاحسب عمرك الآن: https://hasiba.zetawala.com/age-calculator/`
      : `My exact age calculated via Hasiba:\n- Gregorian Age: ${primaryDisplay}\n- Hijri Age: ${hijriFullStr}\n- Total days lived: ${formatDigits(result.totalDays)} days\nCalculate your age: https://hasiba.zetawala.com/en/age-calculator/`;
  }

  return (
    <div className="space-y-6 w-full">
      {/* 1. Input Calendar Mode Toggle */}
      <SegmentedToggle
        value={calendarMode}
        onChange={(m) => setCalendarMode(m)}
        options={[
          {
            value: 'gregorian',
            label: isAr ? '📅 ميلادي (اليوم / الشهر / السنة)' : '📅 Gregorian Date of Birth',
          },
          {
            value: 'hijri',
            label: isAr ? '🌙 هجري (اليوم / الشهر / السنة)' : '🌙 Hijri Date of Birth',
          },
        ]}
      />

      {/* 2. Birth Date Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {calendarMode === 'gregorian' ? (
          <>
            <Select
              label={isAr ? 'يوم الميلاد' : 'Birth Day'}
              value={validGDay}
              onChange={(e) => setGDay(Number(e.target.value))}
              options={Array.from({ length: maxGDay }, (_, i) => ({
                value: i + 1,
                label: formatDigits(i + 1),
              }))}
            />
            <Select
              label={isAr ? 'شهر الميلاد' : 'Birth Month'}
              value={gMonth}
              onChange={(e) => setGMonth(Number(e.target.value))}
              options={(isAr ? GREGORIAN_MONTH_NAMES_AR : GREGORIAN_MONTH_NAMES_EN).map(
                (name, idx) => ({
                  value: idx + 1,
                  label: `${formatDigits(idx + 1)}. ${name}`,
                })
              )}
            />
            <Select
              label={isAr ? 'سنة الميلاد' : 'Birth Year'}
              value={gYear}
              onChange={(e) => setGYear(Number(e.target.value))}
              options={Array.from({ length: 110 }, (_, i) => {
                const y = now.getFullYear() - i;
                return { value: y, label: `${formatDigits(y)} ${isAr ? 'م' : 'CE'}` };
              })}
            />
          </>
        ) : (
          <>
            <Select
              label={isAr ? 'يوم الميلاد (هجري)' : 'Birth Day (Hijri)'}
              value={validHDay}
              onChange={(e) => setHDay(Number(e.target.value))}
              options={Array.from({ length: maxHDay }, (_, i) => ({
                value: i + 1,
                label: formatDigits(i + 1),
              }))}
            />
            <Select
              label={isAr ? 'شهر الميلاد (هجري)' : 'Birth Month (Hijri)'}
              value={hMonth}
              onChange={(e) => setHMonth(Number(e.target.value))}
              options={(isAr ? HIJRI_MONTH_NAMES_AR : HIJRI_MONTH_NAMES_EN).map(
                (name, idx) => ({
                  value: idx + 1,
                  label: `${formatDigits(idx + 1)}. ${name}`,
                })
              )}
            />
            <Select
              label={isAr ? 'سنة الميلاد (هجري)' : 'Birth Year (Hijri)'}
              value={hYear}
              onChange={(e) => setHYear(Number(e.target.value))}
              options={Array.from(
                { length: MAX_HIJRI_YEAR - MIN_HIJRI_YEAR + 1 },
                (_, i) => {
                  const y = MAX_HIJRI_YEAR - i;
                  return { value: y, label: `${formatDigits(y)} ${isAr ? 'هـ' : 'AH'}` };
                }
              )}
            />
          </>
        )}
      </div>

      {/* 3. Optional "Calculate Age On" collapsible section */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setUseCustomTargetDate(!useCustomTargetDate)}
          className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline flex items-center gap-1.5"
        >
          <span>{useCustomTargetDate ? '▼' : '▶'}</span>
          <span>
            {isAr
              ? 'تحديد تاريخ مخصص لحساب العمر (افتراضياً: تاريخ اليوم)'
              : 'Calculate age on a specific custom date (default: today)'}
          </span>
        </button>

        {useCustomTargetDate && (
          <div className="mt-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label={isAr ? 'اليوم المستهدف' : 'Target Day'}
              value={targetDay}
              onChange={(e) => setTargetDay(Number(e.target.value))}
              options={Array.from({ length: 31 }, (_, i) => ({
                value: i + 1,
                label: formatDigits(i + 1),
              }))}
            />
            <Select
              label={isAr ? 'الشهر المستهدف' : 'Target Month'}
              value={targetMonth}
              onChange={(e) => setTargetMonth(Number(e.target.value))}
              options={(isAr ? GREGORIAN_MONTH_NAMES_AR : GREGORIAN_MONTH_NAMES_EN).map(
                (name, idx) => ({
                  value: idx + 1,
                  label: `${formatDigits(idx + 1)}. ${name}`,
                })
              )}
            />
            <Select
              label={isAr ? 'السنة المستهدفة' : 'Target Year'}
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
              options={Array.from({ length: 50 }, (_, i) => {
                const y = now.getFullYear() + 10 - i;
                return { value: y, label: formatDigits(y) };
              })}
            />
          </div>
        )}
      </div>

      {/* 4. Results Display */}
      {error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300">
          ⚠️ {error}
        </div>
      ) : result ? (
        <div className="space-y-4">
          <ResultBox
            locale={locale}
            title={isAr ? 'العمر الدقيق بالميلادي' : 'Exact Gregorian Age'}
            primaryResult={primaryDisplay}
            items={[
              {
                label: isAr ? 'العمر الدقيق بالهجري' : 'Exact Hijri Age',
                value: isAr
                  ? `${formatDigits(result.hijriAge.years)} سنة، ${formatDigits(result.hijriAge.months)} شهر، ${formatDigits(result.hijriAge.days)} يوم`
                  : `${formatDigits(result.hijriAge.years)} yrs, ${formatDigits(result.hijriAge.months)} mos, ${formatDigits(result.hijriAge.days)} days`,
              },
              {
                label: isAr ? 'يوم الأسبوع عند الولادة' : 'Birth Day of Week',
                value: birthWeekdayDisplay,
              },
              {
                label: isAr ? 'تاريخ الميلاد بالتقويم الآخر' : 'Birth Date in Other Calendar',
                value: otherCalendarBirthDisplay,
              },
              {
                label: isAr ? 'موعد يوم الميلاد القادم' : 'Next Birthday',
                value: nextBdayDisplay,
              },
              {
                label: isAr ? 'إجمالي الأيام المعاشة' : 'Total Days Lived',
                value: `${formatDigits(result.totalDays)} ${isAr ? 'يوماً' : 'days'}`,
              },
              {
                label: isAr ? 'إجمالي الأشهر والأسابيع' : 'Total Months & Weeks',
                value: isAr
                  ? `${formatDigits(result.totalMonths)} شهر (${formatDigits(result.totalWeeks)} أسبوع)`
                  : `${formatDigits(result.totalMonths)} mos (${formatDigits(result.totalWeeks)} wks)`,
              },
              {
                label: isAr ? 'الساعات التقريبية' : 'Approximate Hours Lived',
                value: `${formatDigits(result.approxHours.toLocaleString())} ${isAr ? 'ساعة' : 'hours'}`,
              },
            ]}
            shareMessage={shareText}
            notes={
              result.nextGregorianBirthday.adjustmentNote
                ? result.nextGregorianBirthday.adjustmentNote[locale]
                : undefined
            }
          />
        </div>
      ) : null}
    </div>
  );
};
