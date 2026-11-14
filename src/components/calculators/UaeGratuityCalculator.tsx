'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/NumberInput';
import { calculateUaeGratuity, UaeGratuityResult } from '@/lib/gratuity-uae';

interface UaeGratuityCalculatorProps {
  locale: Locale;
  showCountrySwitcher?: boolean;
}

export const UaeGratuityCalculator: React.FC<UaeGratuityCalculatorProps> = ({
  locale,
  showCountrySwitcher = true,
}) => {
  const isAr = locale === 'ar';
  const { formatDigits } = useDigits();

  // Helper defaults (3 completed years ago to today)
  const defaultDates = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const past = new Date(Date.UTC(now.getUTCFullYear() - 3, now.getUTCMonth(), now.getUTCDate()));
    const pastStr = past.toISOString().split('T')[0];
    return { start: pastStr, end: todayStr };
  }, []);

  // Form Inputs
  const [basicSalaryMonthly, setBasicSalaryMonthly] = useState('10000');
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState('0');
  const [employerDeductions, setEmployerDeductions] = useState('0');

  // UI Copy feedback
  const [copied, setCopied] = useState(false);

  // Currency label
  const currencyLabel = isAr ? 'د.إ' : 'AED';

  // Perform Calculation
  const calculation = useMemo<{ result: UaeGratuityResult | null; error: string | null }>(() => {
    const salaryNum = parseFloat(basicSalaryMonthly);
    if (isNaN(salaryNum) || salaryNum < 0) {
      return {
        result: null,
        error: isAr ? 'يرجى إدخال راتب أساسي صحيح (أكبر من أو يساوي صفر).' : 'Please enter a valid basic salary (≥ 0).',
      };
    }

    if (!startDate || !endDate) {
      return {
        result: null,
        error: isAr ? 'يرجى تحديد تاريخ البداية وتاريخ نهاية الخدمة.' : 'Please specify both start date and end date.',
      };
    }

    const unpaidNum = parseInt(unpaidLeaveDays, 10) || 0;
    const deductionsNum = parseFloat(employerDeductions) || 0;

    try {
      const res = calculateUaeGratuity({
        basicSalaryMonthly: salaryNum,
        startDate,
        endDate,
        unpaidLeaveDays: Math.max(0, unpaidNum),
        employerDeductions: Math.max(0, deductionsNum),
      });
      return { result: res, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid calculation parameters';
      return {
        result: null,
        error: isAr
          ? msg.includes('earlier')
            ? 'تاريخ نهاية الخدمة لا يمكن أن يكون قبل تاريخ البداية.'
            : msg
          : msg,
      };
    }
  }, [basicSalaryMonthly, startDate, endDate, unpaidLeaveDays, employerDeductions, isAr]);

  const { result, error } = calculation;

  const formatCurrency = (val: number | string) => {
    const formatted = typeof val === 'number' ? val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : val;
    return formatDigits(formatted);
  };

  // 1-Click Copy
  const handleCopy = async () => {
    if (!result) return;
    const lines = [
      isAr ? 'حساب مكافأة نهاية الخدمة في دولة الإمارات (قانون العمل 2021)' : 'UAE End of Service Gratuity Calculation (Decree-Law 33/2021)',
      `${isAr ? 'الراتب الأساسي الشهري: ' : 'Monthly Basic Salary: '}${formatCurrency(result.dailyWage * 30)} ${currencyLabel}`,
      `${isAr ? 'مدة الخدمة: ' : 'Length of Service: '}${result.serviceYears} ${isAr ? 'سنة' : 'years'}, ${result.serviceMonths} ${isAr ? 'شهر' : 'months'}, ${result.serviceDays} ${isAr ? 'يوم' : 'days'} (${result.totalServiceDays} ${isAr ? 'يوم عمل' : 'days'})`,
      `${isAr ? 'أجر اليوم المعتمد: ' : 'Statutory Daily Wage: '}${formatCurrency(result.dailyWage)} ${currencyLabel}`,
      `${isAr ? 'مستحقات السنوات الخمس الأولى (21 يوماً/سنة): ' : 'First 5 Years Amount (21 days/yr): '}${formatCurrency(result.firstFiveYearsAmount)} ${currencyLabel}`,
      `${isAr ? 'مستحقات ما بعد الخمس سنوات (30 يوماً/سنة): ' : 'Subsequent Years Amount (30 days/yr): '}${formatCurrency(result.subsequentYearsAmount)} ${currencyLabel}`,
      result.isCapped ? `${isAr ? 'تم تطبيق الحد الأقصى النظامي (أجر سنتين): ' : 'Statutory 2-Year Cap Applied: '}${formatCurrency(result.capAmount)} ${currencyLabel}` : '',
      result.deductions > 0 ? `${isAr ? 'الخصومات / الديون: ' : 'Deductions: '}-${formatCurrency(result.deductions)} ${currencyLabel}` : '',
      `========================`,
      `${isAr ? 'صافي المكافأة المستحقة للصرف: ' : 'Net Final Gratuity Payable: '}${formatCurrency(result.finalGratuityPayable)} ${currencyLabel}`,
      `https://hasiba.zetawala.com/end-of-service/uae/`,
    ].filter(Boolean).join('\n');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(lines);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = lines;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    if (!result) return;
    const msg = isAr
      ? `حساب مكافأة نهاية الخدمة في الإمارات:\n` +
        `مدة الخدمة: ${result.serviceYears} سنة و${result.serviceMonths} شهر\n` +
        `صافي المكافأة المستحقة: ${formatCurrency(result.finalGratuityPayable)} ${currencyLabel}\n` +
        `احسب مستحقاتك بدقة على حاسبة: https://hasiba.zetawala.com/end-of-service/uae/`
      : `UAE End of Service Gratuity Summary:\n` +
        `Service Length: ${result.serviceYears} yrs & ${result.serviceMonths} mos\n` +
        `Final Gratuity Payable: ${formatCurrency(result.finalGratuityPayable)} ${currencyLabel}\n` +
        `Calculate accurately at Hasiba: https://hasiba.zetawala.com/en/end-of-service/uae/`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 w-full">
      {/* Switcher Header */}
      {showCountrySwitcher && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇦🇪</span>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                {isAr ? 'حاسبة مكافأة نهاية الخدمة - دولة الإمارات العربية المتحدة' : 'UAE End of Service Gratuity Calculator'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'مرسوم بقانون اتحادي رقم 33 لسنة 2021 (القطاع الخاص)' : 'Federal Decree-Law No. 33 of 2021 (Private Sector)'}
              </p>
            </div>
          </div>
          <Link
            href={isAr ? '/end-of-service/saudi/' : '/en/end-of-service/saudi/'}
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-900/60 bg-brand-50/60 dark:bg-brand-950/20"
          >
            <span>🇸🇦</span>
            <span>{isAr ? 'الانتقال لحاسبة السعودية (نظام العمل)' : 'Switch to Saudi Arabia Calculator'}</span>
            <span aria-hidden="true" className="rtl:rotate-180">→</span>
          </Link>
        </div>
      )}

      {/* Main Grid: Inputs Left, Result Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-5 sm:p-6 space-y-5">
            {/* Input 1: Basic Monthly Salary */}
            <div>
              <NumberInput
                label={isAr ? 'الراتب الأساسي الشهري' : 'Monthly Basic Salary'}
                placeholder="10000"
                value={basicSalaryMonthly}
                onChange={setBasicSalaryMonthly}
                endAdornment={currencyLabel}
                helperText={
                  isAr
                    ? '⚠️ تنبيه: يُحسب الاستحقاق في الإمارات على الراتب الأساسي فقط (دون البدلات كبدل السكن والمواصلات).'
                    : 'Calculated strictly on the basic wage (excluding allowances such as housing and transport).'
                }
              />
              <p className="mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                {isAr
                  ? 'قاعدة أجر اليوم المعتمدة: الراتب الأساسي الشهري ÷ 30 يوماً'
                  : 'Statutory rule: Daily wage = Monthly basic salary ÷ 30'}
              </p>
            </div>

            {/* Input 2: Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="uae-start-date"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {isAr ? 'تاريخ بداية العمل' : 'Start Date'}
                </label>
                <input
                  id="uae-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="uae-end-date"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {isAr ? 'آخر يوم عمل (تاريخ نهاية الخدمة)' : 'Last Working Day (End Date)'}
                </label>
                <input
                  id="uae-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Input 3: Optional Unpaid Leave & Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <NumberInput
                label={isAr ? 'أيام الإجازة بدون راتب (إن وُجدت)' : 'Unpaid Leave Days (if any)'}
                placeholder="0"
                value={unpaidLeaveDays}
                onChange={setUnpaidLeaveDays}
                endAdornment={isAr ? 'يوم' : 'days'}
                helperText={isAr ? 'تُستبعد أيام الغياب بدون أجر من مدة الخدمة المستمرة' : 'Excluded from the continuous service count'}
              />

              <NumberInput
                label={isAr ? 'ديون أو خصومات لصاحب العمل' : 'Employer Deductions / Debt'}
                placeholder="0"
                value={employerDeductions}
                onChange={setEmployerDeductions}
                endAdornment={currencyLabel}
                helperText={isAr ? 'تُخصم المبالغ المستحقة للشركة من صافي المكافأة' : 'Subtracted directly from final gratuity'}
              />
            </div>

            {/* Note on Resignation */}
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
              <strong>{isAr ? '💡 نظام الاستقالة في الإمارات: ' : '💡 UAE Resignation Rule: '}</strong>
              {isAr
                ? 'بموجب المرسوم بقانون رقم 33 لسنة 2021، ألغيت نسب تخفيض المكافأة عند الاستقالة في القطاع الخاص؛ يستحق الموظف مكافأته كاملة طالما أكمل سنة كاملة من الخدمة المستمرة.'
                : 'Under UAE Federal Decree-Law No. 33 of 2021, resignation does NOT reduce gratuity in the private sector. Employees receive the full statutory award upon completing at least 1 continuous year.'}
            </div>
          </Card>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {error ? (
            <div
              role="alert"
              className="p-5 rounded-2xl border-2 border-red-500/40 bg-red-50/80 dark:bg-red-950/20 text-red-800 dark:text-red-300 text-sm font-medium"
            >
              ⚠️ {error}
            </div>
          ) : result ? (
            <div
              aria-live="polite"
              className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/20 dark:to-slate-900 p-6 sm:p-7 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  {isAr ? 'صافي مكافأة نهاية الخدمة المستحقة' : 'Net End of Service Gratuity'}
                </span>
                {result.serviceYears < 1 ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                    {isAr ? 'أقل من سنة خدمة' : 'Under 1 Year Service'}
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {isAr ? 'مستحق للصرف ✓' : 'Eligible for Payout ✓'}
                  </span>
                )}
              </div>

              {/* Big Primary Result */}
              <div className="flex items-baseline flex-wrap gap-2 my-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                  {formatCurrency(result.finalGratuityPayable)}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {currencyLabel}
                </span>
              </div>

              {/* Service Length Breakdown */}
              <div className="mt-4 p-3 rounded-xl bg-white/90 dark:bg-slate-800/70 border border-emerald-100 dark:border-emerald-900/30 text-xs sm:text-sm space-y-1">
                <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-semibold">
                  <span>{isAr ? 'مدة الخدمة المعتمدة:' : 'Qualifying Service Duration:'}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {formatDigits(result.serviceYears)} {isAr ? 'سنة' : 'yrs'} {isAr ? 'و' : '&'}{' '}
                    {formatDigits(result.serviceMonths)} {isAr ? 'شهر' : 'mos'} {isAr ? 'و' : '&'}{' '}
                    {formatDigits(result.serviceDays)} {isAr ? 'يوم' : 'days'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs">
                  <span>{isAr ? 'إجمالي أيام الخدمة الفعلية:' : 'Total Effective Days:'}</span>
                  <span>{formatDigits(result.totalServiceDays)} {isAr ? 'يوم' : 'days'}</span>
                </div>
                {result.unpaidLeaveDaysExcluded > 0 && (
                  <div className="flex justify-between items-center text-amber-600 dark:text-amber-400 text-xs">
                    <span>{isAr ? 'أيام غير مدفوعة مستبعدة:' : 'Unpaid Leave Excluded:'}</span>
                    <span>-{formatDigits(result.unpaidLeaveDaysExcluded)} {isAr ? 'يوم' : 'days'}</span>
                  </div>
                )}
              </div>

              {/* Gratuity Tiers Breakdown */}
              <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">
                    {isAr ? 'أجر اليوم المعتمد (الأساسي ÷ 30):' : 'Statutory Daily Wage (Basic ÷ 30):'}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(result.dailyWage)} {currencyLabel}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">
                    {isAr ? 'السنوات الخمس الأولى (21 يوماً/سنة):' : 'Years 1 to 5 (21 days/yr):'}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(result.firstFiveYearsAmount)} {currencyLabel}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">
                    {isAr ? 'ما بعد الخمس سنوات (30 يوماً/سنة):' : 'Years 6+ (30 days/yr):'}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(result.subsequentYearsAmount)} {currencyLabel}
                  </span>
                </div>

                {/* 2-Year Cap Notice if applied */}
                {result.isCapped && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span>{isAr ? 'تطبيق الحد الأقصى النظامي (أجر سنتين):' : 'Statutory 2-Year Wage Cap Applied:'}</span>
                      <span>{formatCurrency(result.capAmount)} {currencyLabel}</span>
                    </div>
                    <p className="text-[11px] leading-tight text-amber-700 dark:text-amber-400">
                      {isAr
                        ? `ينص قانون العمل الإماراتي على ألا يتجاوز إجمالي المكافأة أجر سنتين كاملتين (${formatCurrency(result.capAmount)} ${currencyLabel}). المجموع قبل السقف كان ${formatCurrency(result.rawGratuityTotal)} ${currencyLabel}.`
                        : `UAE Labor Law stipulates the total gratuity cannot exceed 2 years' basic wage (${formatCurrency(result.capAmount)} ${currencyLabel}). Pre-cap total was ${formatCurrency(result.rawGratuityTotal)} ${currencyLabel}.`}
                    </p>
                  </div>
                )}

                {/* Employer Deductions */}
                {result.deductions > 0 && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
                    <span>{isAr ? 'خصومات صاحب العمل:' : 'Employer Deductions:'}</span>
                    <span className="font-bold">
                      -{formatCurrency(result.deductions)} {currencyLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* Explanatory note if under 1 year */}
              {result.serviceYears < 1 && (
                <p className="mt-3 text-xs text-amber-700 dark:text-amber-400 leading-relaxed bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  {isAr
                    ? '⚠️ تنص المادة 51 من قانون العمل على عدم استحقاق مكافأة نهاية الخدمة لمن لم يكمل سنة كاملة من الخدمة المستمرة.'
                    : 'Article 51 provides that employees with less than 1 continuous year of service are not entitled to end-of-service gratuity.'}
                </p>
              )}

              {/* Action Buttons: Copy & WhatsApp */}
              <div className="mt-6 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap gap-2.5">
                <Button
                  variant={copied ? 'success' : 'outline'}
                  size="md"
                  onClick={handleCopy}
                  className="flex-1 min-w-[130px]"
                >
                  {copied ? (isAr ? '✓ تم النسخ' : '✓ Copied') : (isAr ? '📋 نسخ النتيجة' : '📋 Copy Result')}
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleWhatsAppShare}
                  className="flex-1 min-w-[130px] bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <span>💬 {isAr ? 'مشاركة واتساب' : 'WhatsApp'}</span>
                </Button>
              </div>
            </div>
          ) : null}

          {/* Ministry Source & Exclusions Disclaimer Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {isAr ? 'المرجع الرسمي:' : 'Official Reference:'}
              </span>
              <a
                href="https://www.mohre.gov.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                {isAr ? 'وزارة الموارد البشرية والتوطين (MOHRE) ↗' : 'UAE MOHRE Portal ↗'}
              </a>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              {isAr
                ? '📌 استثناءات هامة: هذه الحاسبة مخصصة لموظفي وعمال القطاع الخاص في دولة الإمارات. لا تنطبق على المواطنين الإماراتيين الخاضعين لنظام التقاعد والمعاشات، ولا على موظفي المناطق المالية الحرة ذات الأطر المستقلة مثل سوق أبوظبي العالمي (ADGM) ومركز دبي المالي العالمي (DIFC - نظام DEWS)، ولا موظفي القطاع الحكومي.'
                : 'Important Scope: This calculation applies to UAE private sector employees under Federal Decree-Law 33/2021. It does not apply to UAE nationals (covered by the federal/local pension authority), DIFC/ADGM financial free zones with independent workplace savings schemes, or government entities.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
