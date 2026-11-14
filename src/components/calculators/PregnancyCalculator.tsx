'use client';

import React, { useState, useMemo } from 'react';
import { Locale } from '@/i18n/types';
import {
  calculatePregnancy,
  PregnancyMode,
  PregnancyResult,
  PregnancyMilestone,
} from '@/lib/pregnancy';
import {
  gregorianToHijri,
  hijriMonthLength,
  getHijriMonthName,
} from '@/lib/hijri';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import { Select } from '@/components/ui/Select';
import { DateFields } from '@/components/ui/DateFields';
import { useDigits } from '@/context/DigitsContext';
import {
  Calendar,
  Heart,
  Baby,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  Share2,
} from 'lucide-react';

interface PregnancyCalculatorProps {
  locale: Locale;
  className?: string;
}

export const PregnancyCalculator: React.FC<PregnancyCalculatorProps> = ({
  locale,
  className = '',
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';

  // Mode: LMP (Mode A) vs Conception Date (Mode B)
  const [mode, setMode] = useState<PregnancyMode>('lmp');

  // Calendar type: Gregorian vs Hijri
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');

  // Today reference
  const now = useMemo(() => new Date(), []);

  // Sensible default: 8 weeks (56 days) prior to today
  const defaultDate = useMemo(() => {
    return new Date(now.getTime() - 56 * 86400000);
  }, [now]);

  const defaultHijri = useMemo(() => {
    return gregorianToHijri(defaultDate);
  }, [defaultDate]);

  // Gregorian inputs
  const [gDay, setGDay] = useState<number>(defaultDate.getUTCDate());
  const [gMonth, setGMonth] = useState<number>(defaultDate.getUTCMonth() + 1);
  const [gYear, setGYear] = useState<number>(defaultDate.getUTCFullYear());

  // Hijri inputs
  const [hDay, setHDay] = useState<number>(defaultHijri.day);
  const [hMonth, setHMonth] = useState<number>(defaultHijri.month);
  const [hYear, setHYear] = useState<number>(defaultHijri.year);

  // Menstrual cycle length (Mode A only): 21 to 35, default 28
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Active milestone tab for preview
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  // Dynamic day limit validation for Hijri and Gregorian
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

  const safeGDay = Math.min(gDay, maxGDay);
  const safeHDay = Math.min(hDay, maxHDay);

  // Calculate clinical pregnancy results
  const calculation = useMemo(() => {
    try {
      const result: PregnancyResult = calculatePregnancy({
        mode,
        calendarType,
        date:
          calendarType === 'gregorian'
            ? { year: gYear, month: gMonth, day: safeGDay }
            : { year: hYear, month: hMonth, day: safeHDay },
        cycleLength: mode === 'lmp' ? cycleLength : 28,
        referenceDate: now,
      });

      return { result, error: null };
    } catch (err: unknown) {
      let message = isAr
        ? 'حدث خطأ في معالجة التاريخ المدخل.'
        : 'An error occurred while calculating pregnancy data.';

      if (err instanceof Error) {
        if (err.name === 'PregnancyDateInFutureError') {
          message = isAr
            ? 'تاريخ البداية المحدد لا يمكن أن يكون في المستقبل بالنسبة لليوم.'
            : 'The selected date cannot be in the future relative to today.';
        } else if (err.name === 'CycleLengthOutOfRangeError') {
          message = isAr
            ? 'طول الدورة الشهرية يجب أن يكون بين 21 و 35 يوماً.'
            : 'Menstrual cycle length must be between 21 and 35 days.';
        } else {
          message = err.message;
        }
      }

      return { result: null, error: message };
    }
  }, [mode, calendarType, gYear, gMonth, safeGDay, hYear, hMonth, safeHDay, cycleLength, now, isAr]);

  const { result, error } = calculation;

  // Format share message
  const shareMessage = useMemo(() => {
    if (!result) return '';
    const eddGreg = result.gregorianDueDate.formatted[locale];
    const eddHijri = result.hijriDueDate.formatted[locale];
    const currentProg = isAr
      ? `الأسبوع ${formatDigits(result.currentWeek)}، اليوم ${formatDigits(result.currentDayOfCurrentWeek)}`
      : `Week ${formatDigits(result.currentWeek)}, Day ${formatDigits(result.currentDayOfCurrentWeek)}`;

    if (isAr) {
      return `حاسبة الحمل وموعد الولادة - حاسبة:
👶 موعد الولادة المتوقع (ميلادي): ${eddGreg}
🌙 موعد الولادة المتوقع (هجري): ${eddHijri}
⏳ مرحلة الحمل الحالية: ${currentProg} (${result.trimesterName.ar})
📅 الأيام المتبقية حتى الولادة: ${formatDigits(result.daysRemaining)} يوماً
احسبي موعد ولادتك بدقة الآن: https://hasiba.zetawala.com/pregnancy-calculator/`;
    }

    return `Pregnancy Due Date & Milestones - Hasiba:
👶 Estimated Due Date (Gregorian): ${eddGreg}
🌙 Estimated Due Date (Hijri): ${eddHijri}
⏳ Current Progress: ${currentProg} (${result.trimesterName.en})
📅 Days Remaining: ${formatDigits(result.daysRemaining)} days
Calculate your due date: https://hasiba.zetawala.com/en/pregnancy-calculator/`;
  }, [result, locale, isAr, formatDigits]);

  return (
    <div className={`space-y-6 w-full ${className}`}>
      {/* 1. Mode Switcher (Mode A vs Mode B) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {isAr ? 'طريقة الحساب المعتمدة:' : 'Calculation Method:'}
        </label>
        <SegmentedToggle
          value={mode}
          onChange={(m) => setMode(m)}
          options={[
            {
              value: 'lmp',
              label: isAr ? 'آخر دورة شهرية (LMP)' : 'Last Menstrual Period (LMP)',
              icon: <Calendar className="w-4 h-4" />,
            },
            {
              value: 'conception',
              label: isAr ? 'تاريخ حدوث الحمل (الإخصاب)' : 'Conception Date',
              icon: <Heart className="w-4 h-4" />,
            },
          ]}
        />
      </div>

      {/* 2. Calendar System Toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {isAr ? 'تقويم الإدخال:' : 'Input Calendar System:'}
        </label>
        <SegmentedToggle
          value={calendarType}
          onChange={(c) => setCalendarType(c)}
          options={[
            {
              value: 'gregorian',
              label: isAr ? '📅 التقويم الميلادي' : '📅 Gregorian Calendar',
            },
            {
              value: 'hijri',
              label: isAr ? '🌙 التقويم الهجري (أم القرى)' : '🌙 Hijri (Umm al-Qura)',
            },
          ]}
        />
      </div>

      {/* 3. Date Inputs using DateFields */}
      <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-white block mb-1">
            {mode === 'lmp'
              ? isAr
                ? 'تاريخ أول يوم من آخر دورة شهرية:'
                : 'First day of last menstrual period (LMP):'
              : isAr
                ? 'تاريخ حدوث الإخصاب أو الحمل:'
                : 'Estimated date of conception:'}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'lmp'
              ? isAr
                ? 'حددي اليوم الأول الذي بدأ فيه نزول دم الحيض لآخر دورة.'
                : 'Select the exact first day bleeding started for your last cycle.'
              : isAr
                ? 'تاريخ التبويض أو يوم التلقيح المرجح طبياً.'
                : 'The estimated day of ovulation, insemination, or embryo transfer.'}
          </p>
        </div>

        <DateFields
          calendarType={calendarType}
          day={calendarType === 'gregorian' ? safeGDay : safeHDay}
          month={calendarType === 'gregorian' ? gMonth : hMonth}
          year={calendarType === 'gregorian' ? gYear : hYear}
          onDayChange={(d) => (calendarType === 'gregorian' ? setGDay(d) : setHDay(d))}
          onMonthChange={(m) => (calendarType === 'gregorian' ? setGMonth(m) : setHMonth(m))}
          onYearChange={(y) => (calendarType === 'gregorian' ? setGYear(y) : setHYear(y))}
          locale={locale}
          minYear={calendarType === 'gregorian' ? now.getFullYear() - 2 : defaultHijri.year - 2}
          maxYear={calendarType === 'gregorian' ? now.getFullYear() : defaultHijri.year + 1}
        />
      </div>

      {/* 4. Cycle Length Selector (Shown for Mode A only) */}
      {mode === 'lmp' && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <label
                htmlFor="cycle-length-select"
                className="text-sm font-bold text-slate-800 dark:text-slate-200 block"
              >
                {isAr ? 'متوسط طول الدورة الشهرية (بالأيام):' : 'Average Menstrual Cycle Length:'}
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isAr
                  ? 'المدة بين أول يوم للدورة وأول يوم للدورة التي تليها (المعدل الطبيعي 21 - 35 يوماً).'
                  : 'Number of days from the start of one period to the start of the next (normal range: 21-35 days).'}
              </span>
            </div>

            <div className="w-full sm:w-48">
              <Select
                id="cycle-length-select"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                options={Array.from({ length: 15 }, (_, i) => {
                  const days = 21 + i;
                  const isStandard = days === 28;
                  const label = isAr
                    ? `${formatDigits(days)} يوماً${isStandard ? ' (المعدل الشائع)' : ''}`
                    : `${formatDigits(days)} days${isStandard ? ' (Standard)' : ''}`;
                  return { value: days, label };
                })}
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Error State */}
      {error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{isAr ? 'تنبيه إدخال التاريخ' : 'Input Notice'}</p>
            <p className="text-xs mt-1 text-amber-800 dark:text-amber-300">{error}</p>
          </div>
        </div>
      )}

      {/* 6. Live Results Section */}
      {result && (
        <div aria-live="polite" className="space-y-6">
          {/* Main Primary Result Card */}
          <div className="rounded-3xl border-2 border-brand-500/30 bg-gradient-to-b from-brand-50/60 via-white to-white dark:from-brand-950/20 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-8 shadow-sm">
            {/* Top Trimester Badge & Past Due Warning */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-900 dark:bg-brand-900/60 dark:text-brand-200 border border-brand-200 dark:border-brand-800">
                <Baby className="w-3.5 h-3.5" />
                <span>{result.trimesterName[locale]}</span>
              </div>

              {result.isPastDue ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  {isAr
                    ? `تجاوز الموعد بـ ${formatDigits(result.daysPastDue)} يوماً`
                    : `Past due date by ${formatDigits(result.daysPastDue)} days`}
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {isAr
                    ? `متبقي ${formatDigits(result.daysRemaining)} يوماً حتى الولادة`
                    : `${formatDigits(result.daysRemaining)} days until due date`}
                </span>
              )}
            </div>

            {/* Big Estimated Due Date */}
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400 mb-1">
              {isAr ? 'موعد الولادة المتوقع (EDD)' : 'Estimated Date of Delivery (EDD)'}
            </p>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white tracking-tight">
                {result.gregorianDueDate.formatted[locale]}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-brand-700 dark:text-brand-300">
                {result.hijriDueDate.formatted[locale]}
              </div>
            </div>

            {/* Current Pregnancy Progress & Visual Progress Bar */}
            <div className="mt-6 pt-5 border-t border-brand-100 dark:border-brand-900/40 space-y-3">
              <div className="flex flex-wrap items-center justify-between text-sm gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {isAr ? 'مرحلة الحمل الحالية اليوم:' : 'Current Pregnancy Progress:'}
                </span>
                <span className="font-extrabold text-brand-800 dark:text-brand-300">
                  {isAr
                    ? `الأسبوع ${formatDigits(result.currentWeek)}، اليوم ${formatDigits(result.currentDayOfCurrentWeek)}`
                    : `Week ${formatDigits(result.currentWeek)}, Day ${formatDigits(result.currentDayOfCurrentWeek)}`}
                  <span className="text-xs font-normal text-slate-500 ms-1.5">
                    ({formatDigits(result.totalDaysPregnancy)} {isAr ? 'يوماً من الحمل' : 'gestation days'})
                  </span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div
                  className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700"
                  role="progressbar"
                  aria-valuenow={result.progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="bg-gradient-to-r from-brand-600 to-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${result.progressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{isAr ? 'بداية الحمل' : 'Conception'}</span>
                  <span className="font-bold text-brand-700 dark:text-brand-300">
                    {formatDigits(result.progressPercentage)}% {isAr ? 'مكتمل' : 'completed'}
                  </span>
                  <span>{isAr ? 'الأسبوع 40 (الولادة)' : 'Week 40 (Birth)'}</span>
                </div>
              </div>
            </div>

            {/* Breakdown Data Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block mb-0.5">
                  {mode === 'lmp'
                    ? isAr
                      ? 'تاريخ الإخصاب التقديري'
                      : 'Estimated Conception Date'
                    : isAr
                      ? 'تاريخ الإخصاب المعتمد'
                      : 'Confirmed Conception Date'}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {result.conceptionDate.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block mb-0.5">
                  {isAr ? 'تاريخ بداية الثلث الثاني' : '2nd Trimester Start'}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(result.equivalentLmpDate.getTime() + 98 * 86400000).toLocaleDateString(
                    isAr ? 'ar-SA' : 'en-US',
                    { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
                  )}
                  <span className="text-slate-400 ms-1 font-normal">
                    ({isAr ? 'الأسبوع 14' : 'Week 14'})
                  </span>
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block mb-0.5">
                  {isAr ? 'تاريخ بداية الثلث الثالث' : '3rd Trimester Start'}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(result.equivalentLmpDate.getTime() + 196 * 86400000).toLocaleDateString(
                    isAr ? 'ar-SA' : 'en-US',
                    { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }
                  )}
                  <span className="text-slate-400 ms-1 font-normal">
                    ({isAr ? 'الأسبوع 28' : 'Week 28'})
                  </span>
                </span>
              </div>
            </div>

            {/* Quick Share and Copy Action Buttons */}
            <div className="mt-5 pt-4 border-t border-brand-100 dark:border-brand-900/40 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(shareMessage);
                  }
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'نسخ ملخص النتيجة' : 'Copy Result Summary'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span>💬</span>
                <span>{isAr ? 'مشاركة عبر واتساب' : 'Share via WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* 7. Interactive Milestones Timeline */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <span>{isAr ? 'جدول المحطات الرئيسية لرحلة الحمل' : 'Pregnancy Milestones Timeline'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {isAr
                    ? 'المواعيد التقديرية للفحوصات والتحولات البيولوجية الهامة للجنين.'
                    : 'Estimated target dates for key developmental scans and clinical milestones.'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isAr ? 'مكتملة' : 'Completed'}
                </span>
                <span className="flex items-center gap-1 text-brand-700 dark:text-brand-400 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                  {isAr ? 'المرحلة الحالية' : 'Current'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {result.milestones.map((m: PregnancyMilestone) => {
                const isSelected = selectedMilestoneId === m.id;
                const isCompleted = m.status === 'completed';
                const isCurrent = m.status === 'current';

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMilestoneId(isSelected ? null : m.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
                      isCurrent
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 ring-2 ring-brand-500/20'
                        : isCompleted
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            isCurrent
                              ? 'bg-brand-600 text-white'
                              : isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {isAr ? `الأسبوع ${formatDigits(m.weekRange)}` : `Week ${formatDigits(m.weekRange)}`}
                        </span>

                        <span className="text-xs font-semibold">
                          {isCompleted ? (
                            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {isAr ? 'تمت' : 'Done'}
                            </span>
                          ) : isCurrent ? (
                            <span className="text-brand-700 dark:text-brand-400 font-bold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-brand-600 animate-ping" />
                              {isAr ? 'الآن' : 'Now'}
                            </span>
                          ) : (
                            <span className="text-slate-400">{isAr ? 'قادمة' : 'Upcoming'}</span>
                          )}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                        {m.title[locale]}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                        {m.description[locale]}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {m.targetDate.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDigits(m.hijriDate.day)} {getHijriMonthName(m.hijriDate.month, locale)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 8. Reassuring Medical Disclaimer Banner */}
      <div
        role="note"
        className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-3.5"
      >
        <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900 dark:text-white">
            {isAr ? 'إخلاء مسؤولية طبية وقانونية:' : 'Medical & Clinical Disclaimer:'}
          </p>
          <p className="leading-relaxed">
            {isAr
              ? 'إخلاء مسؤولية طبية: هذه الحاسبة هي أداة تقديرية مبنية على الحسابات الإحصائية الفلكية والطبية العامة (قاعدة نيجيلي)، ولا تغني بأي حال عن الفحص السريري وإشراف الطبيب المختص أو نتائج الفحص بالموجات فوق الصوتية (السونار).'
              : 'Medical Disclaimer: This pregnancy calculator is an estimation tool based on clinical statistical formulas (Naegele’s rule) and astronomical calendar data. It does not replace professional clinical evaluation, obstetrical consultation, or dating ultrasound scans.'}
          </p>
        </div>
      </div>
    </div>
  );
};
