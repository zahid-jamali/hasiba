'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import {
  gregorianToHijri,
  hijriToGregorian,
  hijriMonthLength,
  getHijriMonthName,
  getWeekdayName,
  HIJRI_MONTH_NAMES_AR,
  HIJRI_MONTH_NAMES_EN,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
  MIN_HIJRI_YEAR,
  MAX_HIJRI_YEAR,
} from '@/lib/hijri';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import { Select } from '@/components/ui/Select';
import { ResultBox } from '@/components/ui/ResultBox';
import { useDigits } from '@/context/DigitsContext';

interface HijriConverterCalculatorProps {
  locale: Locale;
}

export const HijriConverterCalculator: React.FC<HijriConverterCalculatorProps> = ({
  locale,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';

  // Mode: 'h2g' (Hijri -> Gregorian) or 'g2h' (Gregorian -> Hijri)
  const [mode, setMode] = useState<'h2g' | 'g2h'>('h2g');

  // Hijri inputs
  const [hDay, setHDay] = useState(1);
  const [hMonth, setHMonth] = useState(1);
  const [hYear, setHYear] = useState(1446);

  // Gregorian inputs
  const [gDay, setGDay] = useState(7);
  const [gMonth, setGMonth] = useState(7);
  const [gYear, setGYear] = useState(2024);

  // Calculate actual month length for Hijri
  const currentHijriMonthLength = useMemo(() => {
    try {
      return hijriMonthLength(hYear, hMonth);
    } catch {
      return 30;
    }
  }, [hYear, hMonth]);

  // Calculate actual month length for Gregorian
  const currentGregorianMonthLength = useMemo(() => {
    return new Date(Date.UTC(gYear, gMonth, 0)).getUTCDate();
  }, [gYear, gMonth]);

  // Adjust day if month length changed
  const validHDay = Math.min(hDay, currentHijriMonthLength);
  const validGDay = Math.min(gDay, currentGregorianMonthLength);

  // Perform Conversion
  const conversionResult = useMemo(() => {
    const today = new Date();
    const todayMs = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

    if (mode === 'h2g') {
      try {
        const gDate = hijriToGregorian(hYear, hMonth, validHDay);
        const weekday = gDate.getUTCDay();
        const weekdayStr = getWeekdayName(weekday, locale);
        const gMonthStr = isAr
          ? GREGORIAN_MONTH_NAMES_AR[gDate.getUTCMonth()]
          : GREGORIAN_MONTH_NAMES_EN[gDate.getUTCMonth()];

        const primaryText = `${formatDigits(gDate.getUTCDate())} ${gMonthStr} ${formatDigits(gDate.getUTCFullYear())} ${isAr ? 'م' : 'CE'}`;

        const diffDays = Math.round((gDate.getTime() - todayMs) / 86400000);
        const relativeTimeStr = formatRelativeTime(diffDays, isAr, formatDigits);

        const shareMessage = isAr
          ? `تحويل التاريخ: ${formatDigits(validHDay)} ${getHijriMonthName(hMonth, 'ar')} ${formatDigits(hYear)} هـ يوافق ${weekdayStr} ${primaryText}\nعبر حاسبة: https://hasiba.zetawala.com/hijri-converter/`
          : `Date Conversion: ${formatDigits(validHDay)} ${getHijriMonthName(hMonth, 'en')} ${formatDigits(hYear)} AH corresponds to ${weekdayStr}, ${primaryText}\nVia Hasiba: https://hasiba.zetawala.com/en/hijri-converter/`;

        return {
          error: null,
          title: isAr ? `المقابل بالميلادي (${weekdayStr})` : `Gregorian Result (${weekdayStr})`,
          primaryText,
          weekday: weekdayStr,
          relativeTime: relativeTimeStr,
          shareMessage,
          hijriYear: hYear,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid date';
        return { error: msg };
      }
    } else {
      try {
        const gDate = new Date(Date.UTC(gYear, gMonth - 1, validGDay, 12, 0, 0));
        const hDate = gregorianToHijri(gDate);
        const weekdayStr = getWeekdayName(hDate.weekday, locale);
        const hMonthStr = getHijriMonthName(hDate.month, locale);

        const primaryText = `${formatDigits(hDate.day)} ${hMonthStr} ${formatDigits(hDate.year)} ${isAr ? 'هـ' : 'AH'}`;

        const diffDays = Math.round((gDate.getTime() - todayMs) / 86400000);
        const relativeTimeStr = formatRelativeTime(diffDays, isAr, formatDigits);

        const shareMessage = isAr
          ? `تحويل التاريخ: ${formatDigits(validGDay)} ${GREGORIAN_MONTH_NAMES_AR[gMonth - 1]} ${formatDigits(gYear)} م يوافق ${weekdayStr} ${primaryText}\nعبر حاسبة: https://hasiba.zetawala.com/hijri-converter/`
          : `Date Conversion: ${formatDigits(validGDay)} ${GREGORIAN_MONTH_NAMES_EN[gMonth - 1]} ${formatDigits(gYear)} CE corresponds to ${weekdayStr}, ${primaryText}\nVia Hasiba: https://hasiba.zetawala.com/en/hijri-converter/`;

        return {
          error: null,
          title: isAr ? `المقابل بالهجري (${weekdayStr})` : `Hijri Result (${weekdayStr})`,
          primaryText,
          weekday: weekdayStr,
          relativeTime: relativeTimeStr,
          shareMessage,
          hijriYear: hDate.year,
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Invalid date';
        return { error: msg };
      }
    }
  }, [mode, hYear, hMonth, validHDay, gYear, gMonth, validGDay, isAr, locale, formatDigits]);

  return (
    <div className="space-y-6 w-full">
      {/* 1. Mode Tabs */}
      <SegmentedToggle
        value={mode}
        onChange={(newMode) => setMode(newMode)}
        options={[
          {
            value: 'h2g',
            label: isAr ? 'هجري ← ميلادي' : 'Hijri → Gregorian',
          },
          {
            value: 'g2h',
            label: isAr ? 'ميلادي ← هجري' : 'Gregorian → Hijri',
          },
        ]}
      />

      {/* 2. Date Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mode === 'h2g' ? (
          <>
            {/* Hijri Day Select */}
            <Select
              label={isAr ? 'اليوم الهجري' : 'Hijri Day'}
              value={validHDay}
              onChange={(e) => setHDay(Number(e.target.value))}
              options={Array.from({ length: currentHijriMonthLength }, (_, i) => ({
                value: i + 1,
                label: formatDigits(i + 1),
              }))}
            />

            {/* Hijri Month Select */}
            <Select
              label={isAr ? 'الشهر الهجري' : 'Hijri Month'}
              value={hMonth}
              onChange={(e) => setHMonth(Number(e.target.value))}
              options={(isAr ? HIJRI_MONTH_NAMES_AR : HIJRI_MONTH_NAMES_EN).map(
                (name, idx) => ({
                  value: idx + 1,
                  label: `${formatDigits(idx + 1)}. ${name}`,
                })
              )}
            />

            {/* Hijri Year Select */}
            <Select
              label={isAr ? 'السنة الهجرية' : 'Hijri Year'}
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
        ) : (
          <>
            {/* Gregorian Day Select */}
            <Select
              label={isAr ? 'اليوم الميلادي' : 'Gregorian Day'}
              value={validGDay}
              onChange={(e) => setGDay(Number(e.target.value))}
              options={Array.from({ length: currentGregorianMonthLength }, (_, i) => ({
                value: i + 1,
                label: formatDigits(i + 1),
              }))}
            />

            {/* Gregorian Month Select */}
            <Select
              label={isAr ? 'الشهر الميلادي' : 'Gregorian Month'}
              value={gMonth}
              onChange={(e) => setGMonth(Number(e.target.value))}
              options={(isAr ? GREGORIAN_MONTH_NAMES_AR : GREGORIAN_MONTH_NAMES_EN).map(
                (name, idx) => ({
                  value: idx + 1,
                  label: `${formatDigits(idx + 1)}. ${name}`,
                })
              )}
            />

            {/* Gregorian Year Select */}
            <Select
              label={isAr ? 'السنة الميلادية' : 'Gregorian Year'}
              value={gYear}
              onChange={(e) => setGYear(Number(e.target.value))}
              options={Array.from({ length: 155 }, (_, i) => {
                const y = 2075 - i;
                return { value: y, label: `${formatDigits(y)} ${isAr ? 'م' : 'CE'}` };
              })}
            />
          </>
        )}
      </div>

      {/* 3. Result Box */}
      {conversionResult.error ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-700 dark:text-red-300">
          ⚠️ {conversionResult.error}
        </div>
      ) : (
        <div className="space-y-4">
          <ResultBox
            locale={locale}
            title={conversionResult.title}
            primaryResult={conversionResult.primaryText || ''}
            items={[
              {
                label: isAr ? 'اليوم في الأسبوع' : 'Day of Week',
                value: conversionResult.weekday || '',
              },
              {
                label: isAr ? 'الفارق الزمني' : 'Time Interval',
                value: conversionResult.relativeTime || '',
              },
            ]}
            shareMessage={conversionResult.shareMessage}
          />

          {/* Quick link to Programmatic Calendar of that year */}
          {conversionResult.hijriYear && (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {isAr
                  ? `تصفح جدول التقويم الهجري الكامل لعام ${formatDigits(conversionResult.hijriYear)} هـ:`
                  : `Browse complete annual calendar for ${formatDigits(conversionResult.hijriYear)} AH:`}
              </span>
              <Link
                href={
                  isAr
                    ? `/hijri-calendar/${conversionResult.hijriYear}/`
                    : `/en/hijri-calendar/${conversionResult.hijriYear}/`
                }
                className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>{isAr ? 'عرض تقويم السنة' : 'View Full Year'}</span>
                <span>{isAr ? '←' : '→'}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function formatRelativeTime(
  diffDays: number,
  isAr: boolean,
  formatDigits: (n: number | string) => string
): string {
  if (diffDays === 0) {
    return isAr ? 'اليوم' : 'Today';
  }

  const isPast = diffDays < 0;
  const absDays = Math.abs(diffDays);

  if (absDays >= 365) {
    const years = Math.floor(absDays / 365.25);
    if (isAr) {
      return isPast
        ? `قبل ${formatDigits(years)} سنة تقريباً (${formatDigits(absDays)} يوماً مضت)`
        : `بعد ${formatDigits(years)} سنة تقريباً (${formatDigits(absDays)} يوماً متبقية)`;
    }
    return isPast
      ? `About ${formatDigits(years)} years ago (${formatDigits(absDays)} days ago)`
      : `In about ${formatDigits(years)} years (${formatDigits(absDays)} days left)`;
  }

  if (isAr) {
    return isPast
      ? `قبل ${formatDigits(absDays)} يوماً`
      : `بعد ${formatDigits(absDays)} يوماً`;
  }
  return isPast ? `${formatDigits(absDays)} days ago` : `In ${formatDigits(absDays)} days`;
}
