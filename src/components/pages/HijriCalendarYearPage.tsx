'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import {
  hijriToGregorian,
  hijriMonthLength,
  getHijriMonthName,
  getMonthDaysGrid,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
} from '@/lib/hijri';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { AdSlot } from '@/components/ui/AdSlot';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';
import { useDigits } from '@/context/DigitsContext';

interface HijriCalendarYearPageProps {
  year: number;
  locale: Locale;
}

export const HijriCalendarYearPage: React.FC<HijriCalendarYearPageProps> = ({
  year,
  locale,
}) => {
  const { formatDigits } = useDigits();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const homePath = isAr ? '/' : '/en/';

  const prevYear = year > 1440 ? year - 1 : null;
  const nextYear = year < 1455 ? year + 1 : null;

  // Key Event Dates for this year:
  // 1. Ramadan start & end
  const ramadanLen = hijriMonthLength(year, 9);
  const ramadanStart = hijriToGregorian(year, 9, 1);
  const ramadanEnd = hijriToGregorian(year, 9, ramadanLen);

  // 2. Eid al-Fitr (1 Shawwal)
  const eidFitrStart = hijriToGregorian(year, 10, 1);

  // 3. Day of Arafah & Eid al-Adha (9 & 10 Dhu al-Hijjah)
  const arafahDay = hijriToGregorian(year, 12, 9);
  const eidAdhaStart = hijriToGregorian(year, 12, 10);

  const formatGDate = (d: Date) => {
    const day = d.getUTCDate();
    const m = d.getUTCMonth();
    const y = d.getUTCFullYear();
    const mName = isAr ? GREGORIAN_MONTH_NAMES_AR[m] : GREGORIAN_MONTH_NAMES_EN[m];
    return `${formatDigits(day)} ${mName} ${formatDigits(y)}`;
  };

  const breadcrumbs = [
    { label: t.common.home, href: homePath },
    {
      label: isAr ? 'محول التاريخ' : 'Date Converter',
      href: isAr ? '/hijri-converter/' : '/en/hijri-converter/',
    },
    {
      label: isAr ? `التقويم الهجري ${formatDigits(year)}` : `Hijri Calendar ${formatDigits(year)}`,
    },
  ];

  return (
    <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Top Navigation & Digits Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <DigitsPreferenceToggle locale={locale} />
      </div>

      {/* Header & Year Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
            {isAr
              ? `التقويم الهجري لعام ${formatDigits(year)} هـ وتواريخه بالميلادي`
              : `Hijri Calendar for Year ${formatDigits(year)} AH with Gregorian Equivalents`}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            {isAr
              ? `جدول كامل لكافة أشهر وأيام عام ${formatDigits(year)} هجرية وفق تقويم أم القرى مع مواعيد شهر رمضان وعيدي الفطر والأضحى.`
              : `Complete Umm al-Qura calendar table for all 12 lunar months of ${formatDigits(year)} AH including Ramadan and Eid schedules.`}
          </p>
        </div>

        {/* Previous / Next Year Pagination */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {prevYear && (
            <Link
              href={isAr ? `/hijri-calendar/${prevYear}/` : `/en/hijri-calendar/${prevYear}/`}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors min-h-[44px] flex items-center"
            >
              {isAr ? `← عام ${formatDigits(prevYear)}` : `← Year ${formatDigits(prevYear)}`}
            </Link>
          )}

          {nextYear && (
            <Link
              href={isAr ? `/hijri-calendar/${nextYear}/` : `/en/hijri-calendar/${nextYear}/`}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors min-h-[44px] flex items-center"
            >
              {isAr ? `عام ${formatDigits(nextYear)} →` : `Year ${formatDigits(nextYear)} →`}
            </Link>
          )}
        </div>
      </div>

      {/* Key Religious Dates Summary Card */}
      <Card variant="accent" className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
          <span>🌙</span>
          <span>
            {isAr
              ? `أبرز المناسبات الدينية في عام ${formatDigits(year)} هـ`
              : `Key Islamic Occasions in ${formatDigits(year)} AH`}
          </span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
          {/* Ramadan */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
              {isAr ? 'شهر رمضان المبارك' : 'Holy Ramadan'}
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {formatGDate(ramadanStart)} – {formatGDate(ramadanEnd)}
            </p>
          </div>

          {/* Eid al-Fitr */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
              {isAr ? 'عيد الفطر المبارك' : 'Eid al-Fitr'}
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {isAr ? 'يبدأ في: ' : 'Begins: '} {formatGDate(eidFitrStart)}
            </p>
          </div>

          {/* Day of Arafah */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
              {isAr ? 'يوم عرفة (9 ذو الحجة)' : 'Day of Arafah'}
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {formatGDate(arafahDay)}
            </p>
          </div>

          {/* Eid al-Adha */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
              {isAr ? 'عيد الأضحى المبارك' : 'Eid al-Adha'}
            </span>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              {isAr ? 'يبدأ في: ' : 'Begins: '} {formatGDate(eidAdhaStart)}
            </p>
          </div>
        </div>
      </Card>

      {/* Ad slot #1 */}
      <AdSlot minHeight={90} slotId="annual-calendar-top" />

      {/* 12 Month Calendar Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const monthName = getHijriMonthName(m, locale);
          const cells = getMonthDaysGrid(year, m);

          return (
            <Card key={m} className="p-4 space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {formatDigits(m)}. {monthName}
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {formatDigits(cells.length)} {isAr ? 'يوماً' : 'days'}
                </span>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
                {(isAr ? ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']).map(
                  (dn, idx) => (
                    <div key={idx}>{dn}</div>
                  )
                )}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: cells[0]?.weekday || 0 }).map((_, i) => (
                  <div key={`b-${i}`} className="h-8" />
                ))}

                {cells.map((cell) => (
                  <div
                    key={cell.hijriDay}
                    className="h-8 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col items-center justify-center text-center"
                    title={`${cell.hijriDay} ${monthName} = ${cell.gregorianDay}/${cell.gregorianMonth}`}
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                      {formatDigits(cell.hijriDay)}
                    </span>
                    <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                      {formatDigits(cell.gregorianDay)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Ad slot #2 */}
      <AdSlot minHeight={250} slotId="annual-calendar-bottom" />
    </article>
  );
};
