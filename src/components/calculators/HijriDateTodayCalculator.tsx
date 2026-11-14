'use client';

import React, { useState, useEffect } from 'react';
import { Locale } from '@/i18n/types';
import {
  gregorianToHijri,
  getHijriMonthName,
  getWeekdayName,
  getMonthDaysGrid,
  getUpcomingIslamicEvents,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
  HijriDayCell,
  IslamicEvent,
} from '@/lib/hijri';
import { ResultBox } from '@/components/ui/ResultBox';
import { useDigits } from '@/context/DigitsContext';

interface HijriDateTodayCalculatorProps {
  locale: Locale;
  initialBuildTimeDateIso?: string;
}

export const HijriDateTodayCalculator: React.FC<HijriDateTodayCalculatorProps> = ({
  locale,
  initialBuildTimeDateIso,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';

  // Build-time default date (ensures SEO HTML has current date pre-rendered)
  const initialDate = initialBuildTimeDateIso
    ? new Date(initialBuildTimeDateIso)
    : new Date();

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [hijri, setHijri] = useState(() => gregorianToHijri(initialDate));
  const [gridCells, setGridCells] = useState<HijriDayCell[]>(() =>
    getMonthDaysGrid(hijri.year, hijri.month, initialDate)
  );
  const [upcomingEvents, setUpcomingEvents] = useState<IslamicEvent[]>(() =>
    getUpcomingIslamicEvents(initialDate)
  );

  // Client hydration check: re-check visitor's actual local date
  useEffect(() => {
    try {
      const clientNow = new Date();
      // If client day differs from pre-rendered day, update state
      if (clientNow.toDateString() !== currentDate.toDateString()) {
        setCurrentDate(clientNow);
        const newHijri = gregorianToHijri(clientNow);
        setHijri(newHijri);
        setGridCells(getMonthDaysGrid(newHijri.year, newHijri.month, clientNow));
        setUpcomingEvents(getUpcomingIslamicEvents(clientNow));
      }
    } catch {
      // Ignore client time resolution errors
    }
  }, [currentDate]);

  const weekdayName = getWeekdayName(hijri.weekday, locale);
  const monthName = getHijriMonthName(hijri.month, locale);
  const yearSuffix = isAr ? 'هـ' : 'AH';

  const gDay = currentDate.getDate();
  const gMonth = currentDate.getMonth();
  const gYear = currentDate.getFullYear();
  const gMonthName = isAr
    ? GREGORIAN_MONTH_NAMES_AR[gMonth]
    : GREGORIAN_MONTH_NAMES_EN[gMonth];

  const primaryResultText = `${formatDigits(hijri.day)} ${monthName} ${formatDigits(hijri.year)} ${yearSuffix}`;
  const gregorianDisplay = `${formatDigits(gDay)} ${gMonthName} ${formatDigits(gYear)} ${isAr ? 'م' : 'CE'}`;

  const shareText = isAr
    ? `التاريخ الهجري اليوم: ${weekdayName} ${primaryResultText} الموافق ${gregorianDisplay} (تقويم أم القرى)\nعبر حاسبة: https://hasiba.zetawala.com/hijri-date-today/`
    : `Today's Hijri Date: ${weekdayName}, ${primaryResultText} (${gregorianDisplay}) - Umm al-Qura standard\nVia Hasiba: https://hasiba.zetawala.com/en/hijri-date-today/`;

  return (
    <div className="space-y-8 w-full">
      {/* 1. Big Display: Today's Hijri Date */}
      <ResultBox
        locale={locale}
        title={isAr ? `تاريخ اليوم: ${weekdayName}` : `Today: ${weekdayName}`}
        primaryResult={primaryResultText}
        items={[
          {
            label: isAr ? 'المقابل الميلادي' : 'Gregorian Equivalent',
            value: gregorianDisplay,
          },
          {
            label: isAr ? 'اليوم في الأسبوع' : 'Day of Week',
            value: weekdayName,
          },
          {
            label: isAr ? 'التقويم المعتمد' : 'Calendar Standard',
            value: isAr ? 'تقويم أم القرى (السعودية)' : 'Umm al-Qura (Saudi Arabia)',
          },
        ]}
        shareMessage={shareText}
        notes={
          isAr
            ? 'ملاحظة: تواريخ تقويم أم القرى هي المعتمدة رسمياً في المملكة العربية السعودية. قد تختلف بداية شهر رمضان والأعياد في بعض الدول الإسلامية بيوم واحد تبعاً للرؤية البصرية المحلية للهلال.'
            : 'Note: Umm al-Qura dates are the official standard in Saudi Arabia. Ramadan and Eid in some countries depend on local moon sighting and may differ by one day.'
        }
      />

      {/* 2. Month Grid for Current Hijri Month */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📅</span>
            <span>
              {isAr
                ? `تقويم شهر ${monthName} ${formatDigits(hijri.year)} هـ`
                : `Calendar of ${monthName} ${formatDigits(hijri.year)} AH`}
            </span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isAr
              ? `إجمالي أيام الشهر: ${formatDigits(gridCells.length)} يوماً`
              : `Total days in month: ${formatDigits(gridCells.length)} days`}
          </span>
        </div>

        {/* Calendar Grid Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400 pb-1">
          {(isAr ? [
            'الأحد',
            'الإثنين',
            'الثلاثاء',
            'الأربعاء',
            'الخميس',
            'الجمعة',
            'السبت',
          ] : [
            'Sun',
            'Mon',
            'Tue',
            'Wed',
            'Thu',
            'Fri',
            'Sat',
          ]).map((dayName, idx) => (
            <div key={idx} className="py-1">
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Offset blank cells for the first day's weekday */}
          {Array.from({ length: gridCells[0]?.weekday || 0 }).map((_, i) => (
            <div key={`blank-${i}`} className="min-h-[52px] sm:min-h-[64px]" />
          ))}

          {gridCells.map((cell) => {
            const gMonthShort = isAr
              ? GREGORIAN_MONTH_NAMES_AR[cell.gregorianMonth - 1]
              : GREGORIAN_MONTH_NAMES_EN[cell.gregorianMonth - 1]?.slice(0, 3);

            return (
              <div
                key={cell.hijriDay}
                className={`min-h-[52px] sm:min-h-[64px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  cell.isToday
                    ? 'border-brand-600 bg-brand-50/80 dark:bg-brand-950/60 ring-2 ring-brand-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm sm:text-base font-extrabold ${
                      cell.isToday
                        ? 'text-brand-700 dark:text-brand-300'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {formatDigits(cell.hijriDay)}
                  </span>
                  {cell.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
                  )}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 text-end">
                  <span>{formatDigits(cell.gregorianDay)} </span>
                  <span className="text-[9px] sm:text-[10px]">{gMonthShort}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Upcoming Islamic Events with Day Countdowns */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xl">🕌</span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {isAr ? 'المناسبات الإسلامية القادمة والعد التنازلي' : 'Upcoming Islamic Events & Countdowns'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {upcomingEvents.map((evt) => {
            const gDayStr = evt.gregorianDate.getUTCDate();
            const gMonthNameStr = isAr
              ? GREGORIAN_MONTH_NAMES_AR[evt.gregorianDate.getUTCMonth()]
              : GREGORIAN_MONTH_NAMES_EN[evt.gregorianDate.getUTCMonth()];
            const gYearStr = evt.gregorianDate.getUTCFullYear();

            return (
              <div
                key={evt.key}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                    {evt.name[locale]}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDigits(gDayStr)} {gMonthNameStr} {formatDigits(gYearStr)}
                  </p>
                </div>

                <div className="text-end shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-800 dark:text-brand-300 font-extrabold text-xs sm:text-sm border border-brand-200 dark:border-brand-800">
                    {evt.daysRemaining === 0
                      ? isAr
                        ? 'اليوم!'
                        : 'Today!'
                      : isAr
                      ? `باقي ${formatDigits(evt.daysRemaining)} يوم`
                      : `${formatDigits(evt.daysRemaining)} days left`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
