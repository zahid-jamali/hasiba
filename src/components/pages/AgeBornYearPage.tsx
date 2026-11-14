'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';
import {
  gregorianToHijri,
  GREGORIAN_MONTH_NAMES_AR,
  GREGORIAN_MONTH_NAMES_EN,
} from '@/lib/hijri';
import { calculateAge } from '@/lib/age';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { AdSlot } from '@/components/ui/AdSlot';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';
import { AgeCalculator } from '@/components/calculators/AgeCalculator';
import { useDigits } from '@/context/DigitsContext';

interface AgeBornYearPageProps {
  year: number;
  locale: Locale;
}

export const AgeBornYearPage: React.FC<AgeBornYearPageProps> = ({
  year,
  locale,
}) => {
  const { formatDigits } = useDigits();
  const t = getDictionary(locale);
  const isAr = locale === 'ar';
  const homePath = isAr ? '/' : '/en/';

  const prevYear = year > 1950 ? year - 1 : null;
  const nextYear = year < 2015 ? year + 1 : null;

  // Calculate overlapping Hijri years
  const startHijri = gregorianToHijri(new Date(Date.UTC(year, 0, 1))).year;
  const endHijri = gregorianToHijri(new Date(Date.UTC(year, 11, 31))).year;
  const overlappingHijriText =
    startHijri === endHijri
      ? `${formatDigits(startHijri)} ${isAr ? 'هـ' : 'AH'}`
      : `${formatDigits(startHijri)} – ${formatDigits(endHijri)} ${isAr ? 'هـ' : 'AH'}`;

  // 12-month table calculating exact current age by month of birth
  const now = new Date();
  const monthlyAges = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthName = isAr ? GREGORIAN_MONTH_NAMES_AR[i] : GREGORIAN_MONTH_NAMES_EN[i];
    const age = calculateAge({
      calendarType: 'gregorian',
      birthYear: year,
      birthMonth: month,
      birthDay: 1,
      targetDate: now,
    });
    return {
      month,
      monthName,
      gregorianAge: age.gregorianAge,
      hijriAge: age.hijriAge,
      totalDays: age.totalDays,
    };
  });

  const breadcrumbs = [
    { label: t.common.home, href: homePath },
    {
      label: isAr ? 'حساب العمر' : 'Age Calculator',
      href: isAr ? '/age-calculator/' : '/en/age-calculator/',
    },
    {
      label: isAr ? `مواليد ${formatDigits(year)}` : `Born in ${formatDigits(year)}`,
    },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Breadcrumbs & Digits Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <DigitsPreferenceToggle locale={locale} />
      </div>

      {/* Header & Year Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            {isAr
              ? `كم عمري إذا كنت مواليد سنة ${formatDigits(year)}؟`
              : `How Old Am I If I Was Born in ${formatDigits(year)}?`}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
            {isAr
              ? `حساب دقيق لعمر مواليد عام ${formatDigits(year)} م بالسنوات والأشهر والأيام بالتقويمين الميلادي والهجري (${overlappingHijriText}).`
              : `Detailed age calculation for people born in ${formatDigits(year)} in both Gregorian and Hijri years (${overlappingHijriText}).`}
          </p>
        </div>

        {/* Previous / Next Year Pagination */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {prevYear && (
            <Link
              href={isAr ? `/age-calculator/born-${prevYear}/` : `/en/age-calculator/born-${prevYear}/`}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors min-h-[44px] flex items-center"
            >
              {isAr ? `← مواليد ${formatDigits(prevYear)}` : `← Born ${formatDigits(prevYear)}`}
            </Link>
          )}

          {nextYear && (
            <Link
              href={isAr ? `/age-calculator/born-${nextYear}/` : `/en/age-calculator/born-${nextYear}/`}
              className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors min-h-[44px] flex items-center"
            >
              {isAr ? `مواليد ${formatDigits(nextYear)} →` : `Born ${formatDigits(nextYear)} →`}
            </Link>
          )}
        </div>
      </div>

      {/* Interactive Calculator prefilled with this year */}
      <section aria-label="Interactive Calculator">
        <Card className="p-5 sm:p-7 shadow-sm border-brand-200 dark:border-brand-900/40">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span>🧮</span>
            <span>
              {isAr
                ? `حاسبة العمر المباشرة لمواليد ${formatDigits(year)} م:`
                : `Interactive Age Calculator for ${formatDigits(year)} Births:`}
            </span>
          </h2>
          <AgeCalculator locale={locale} initialBirthYear={year} />
        </Card>
      </section>

      {/* Ad slot #1 */}
      <AdSlot minHeight={90} slotId="born-year-top" />

      {/* 12-Row Table: Age by Birth Month */}
      <section aria-labelledby="month-table-title" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 id="month-table-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {isAr
              ? `جدول عمر مواليد ${formatDigits(year)} حسب شهر الميلاد`
              : `Age Table for Births in ${formatDigits(year)} by Month`}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'محسوب حتى اليوم الحالي' : 'Calculated as of today'}
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200">
              <tr>
                <th className="p-3.5 text-start">{isAr ? 'شهر الميلاد' : 'Birth Month'}</th>
                <th className="p-3.5 text-start">{isAr ? 'العمر بالميلادي' : 'Gregorian Age'}</th>
                <th className="p-3.5 text-start">{isAr ? 'العمر بالهجري التقديري' : 'Hijri Age'}</th>
                <th className="p-3.5 text-start">{isAr ? 'إجمالي الأيام' : 'Total Days'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {monthlyAges.map((row) => (
                <tr
                  key={row.month}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                    {row.monthName} ({formatDigits(row.month)})
                  </td>
                  <td className="p-3.5 text-slate-700 dark:text-slate-300">
                    {formatDigits(row.gregorianAge.years)} {isAr ? 'سنة' : 'yrs'}{' '}
                    {row.gregorianAge.months > 0 &&
                      `و ${formatDigits(row.gregorianAge.months)} ${isAr ? 'شهر' : 'mos'}`}
                  </td>
                  <td className="p-3.5 text-brand-700 dark:text-brand-400 font-semibold">
                    {formatDigits(row.hijriAge.years)} {isAr ? 'سنة هجرية' : 'Hijri yrs'}
                  </td>
                  <td className="p-3.5 text-slate-500 dark:text-slate-400">
                    {formatDigits(row.totalDays)} {isAr ? 'يوم' : 'days'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary Note & Hijri Overlap */}
      <Card variant="muted" className="p-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2">
        <p>
          <strong className="text-slate-900 dark:text-slate-100 font-bold">
            {isAr ? 'التداخل الهجري والميلادي: ' : 'Hijri Calendar Overlap: '}
          </strong>
          {isAr
            ? `مواليد عام ${formatDigits(year)} الميلادي يتطابق تاريخ ميلادهم مع السنتين الهجريتين ${overlappingHijriText} وفقاً لتقويم أم القرى.`
            : `People born in ${formatDigits(year)} CE fall across Hijri years ${overlappingHijriText} according to Umm al-Qura standard.`}
        </p>
        <p>
          {isAr
            ? 'نظراً لأن السنة الهجرية تنقص بنحو 11 يوماً كل عام عن السنة الميلادية، فإن عمرك بالهجري يسبق عمرك بالميلادي بنحو سنة كاملة كل 33 سنة.'
            : 'Because the Hijri lunar year is roughly 11 days shorter than the solar year, your Hijri age advances by approximately 1 full year every 33 solar years.'}
        </p>
      </Card>

      {/* Ad slot #2 */}
      <AdSlot minHeight={250} slotId="born-year-bottom" />
    </article>
  );
};
