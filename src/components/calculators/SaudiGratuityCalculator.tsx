'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/NumberInput';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import {
  calculateSaudiGratuity,
  SaudiGratuityResult,
  SaudiSeparationReason,
} from '@/lib/gratuity-ksa';

interface SaudiGratuityCalculatorProps {
  locale: Locale;
  showCountrySwitcher?: boolean;
}

export const SaudiGratuityCalculator: React.FC<SaudiGratuityCalculatorProps> = ({
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
  const [contractWageMonthly, setContractWageMonthly] = useState('10000');
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [separationReason, setSeparationReason] =
    useState<SaudiSeparationReason>('termination_or_end');
  const [isArticle87Exception, setIsArticle87Exception] = useState(false);
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState('0');
  const [employerDeductions, setEmployerDeductions] = useState('0');

  // Copy feedback
  const [copied, setCopied] = useState(false);

  // Currency label
  const currencyLabel = isAr ? 'ر.س' : 'SAR';

  // Perform Calculation
  const calculation = useMemo<{ result: SaudiGratuityResult | null; error: string | null }>(() => {
    const wageNum = parseFloat(contractWageMonthly);
    if (isNaN(wageNum) || wageNum < 0) {
      return {
        result: null,
        error: isAr
          ? 'يرجى إدخال أجر شهري تعاقدي صحيح (أكبر من أو يساوي صفر).'
          : 'Please enter a valid monthly contract wage (≥ 0).',
      };
    }

    if (!startDate || !endDate) {
      return {
        result: null,
        error: isAr
          ? 'يرجى تحديد تاريخ بداية العمل وتاريخ نهاية الخدمة.'
          : 'Please specify both start date and end date.',
      };
    }

    const unpaidNum = parseInt(unpaidLeaveDays, 10) || 0;
    const deductionsNum = parseFloat(employerDeductions) || 0;

    try {
      const res = calculateSaudiGratuity({
        contractWageMonthly: wageNum,
        startDate,
        endDate,
        separationReason,
        isArticle87Exception: separationReason === 'resignation' && isArticle87Exception,
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
  }, [
    contractWageMonthly,
    startDate,
    endDate,
    separationReason,
    isArticle87Exception,
    unpaidLeaveDays,
    employerDeductions,
    isAr,
  ]);

  const { result, error } = calculation;

  const formatCurrency = (val: number | string) => {
    const formatted =
      typeof val === 'number'
        ? val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : val;
    return formatDigits(formatted);
  };

  const getArticleLabel = (article: 'Article 84' | 'Article 85' | 'Article 87') => {
    switch (article) {
      case 'Article 84':
        return isAr ? 'المادة 84 (إنهاء من صاحب العمل أو انتهاء العقد - استحقاق 100%)' : 'Article 84 (Employer Termination / Expiry - 100% Full Award)';
      case 'Article 85':
        return isAr ? 'المادة 85 (استقالة الموظف وفق الشرائح النظامية)' : 'Article 85 (Employee Resignation Tiered Scale)';
      case 'Article 87':
        return isAr ? 'المادة 87 (استثناء نظامي - استحقاق 100% كامل المكافأة)' : 'Article 87 (Statutory Exception - 100% Full Award)';
    }
  };

  // 1-Click Copy
  const handleCopy = async () => {
    if (!result) return;
    const lines = [
      isAr ? 'حساب مكافأة نهاية الخدمة في السعودية (نظام العمل)' : 'Saudi Arabia End of Service Award Calculation (Saudi Labor Law)',
      `${isAr ? 'الأجر الشهري الفعلي (شامل البدلات): ' : 'Monthly Actual Wage: '}${formatCurrency(result.contractWageMonthly)} ${currencyLabel}`,
      `${isAr ? 'مدة الخدمة المعتمدة: ' : 'Service Duration: '}${result.serviceYears} ${isAr ? 'سنة' : 'years'}, ${result.serviceMonths} ${isAr ? 'شهر' : 'months'}, ${result.serviceDays} ${isAr ? 'يوم' : 'days'} (${result.totalServiceDays} ${isAr ? 'يوم' : 'days'})`,
      `${isAr ? 'السند النظامي المطبق: ' : 'Applied Statutory Article: '}${getArticleLabel(result.appliedArticle)}`,
      `${isAr ? 'المكافأة الأساسية (المادة 84): ' : 'Base Award (Art. 84): '}${formatCurrency(result.baseAwardTotal)} ${currencyLabel}`,
      result.appliedArticle === 'Article 85' ? `${isAr ? 'نسبة الاستحقاق للاستقالة: ' : 'Resignation Entitlement: '}${result.resignationRatioPercentage}%` : '',
      result.deductions > 0 ? `${isAr ? 'الخصومات / الديون: ' : 'Deductions: '}-${formatCurrency(result.deductions)} ${currencyLabel}` : '',
      `========================`,
      `${isAr ? 'صافي مكافأة نهاية الخدمة المستحقة للصرف: ' : 'Net Final Award Payable: '}${formatCurrency(result.finalGratuityPayable)} ${currencyLabel}`,
      `https://hasiba.zetawala.com/end-of-service/saudi/`,
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
      ? `حساب مكافأة نهاية الخدمة في السعودية:\n` +
        `مدة الخدمة: ${result.serviceYears} سنة و${result.serviceMonths} شهر\n` +
        `السند: ${getArticleLabel(result.appliedArticle)}\n` +
        `صافي المكافأة المستحقة: ${formatCurrency(result.finalGratuityPayable)} ${currencyLabel}\n` +
        `احسب مستحقاتك بدقة عبر حاسبة: https://hasiba.zetawala.com/end-of-service/saudi/`
      : `Saudi End of Service Gratuity Summary:\n` +
        `Service Duration: ${result.serviceYears} yrs & ${result.serviceMonths} mos\n` +
        `Basis: ${result.appliedArticle}\n` +
        `Net Award Payable: ${formatCurrency(result.finalGratuityPayable)} ${currencyLabel}\n` +
        `Calculate accurately at Hasiba: https://hasiba.zetawala.com/en/end-of-service/saudi/`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-8 w-full">
      {/* Switcher Header */}
      {showCountrySwitcher && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🇸🇦</span>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                {isAr ? 'حاسبة مكافأة نهاية الخدمة - المملكة العربية السعودية' : 'Saudi Arabia End of Service Gratuity Calculator'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'نظام العمل السعودي (المواد 84 و 85 و 87)' : 'Saudi Labor Law (Articles 84, 85, & 87)'}
              </p>
            </div>
          </div>
          <Link
            href={isAr ? '/end-of-service/uae/' : '/en/end-of-service/uae/'}
            className="text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-900/60 bg-brand-50/60 dark:bg-brand-950/20"
          >
            <span>🇦🇪</span>
            <span>{isAr ? 'الانتقال لحاسبة الإمارات (قانون العمل 2021)' : 'Switch to UAE Calculator'}</span>
            <span aria-hidden="true" className="rtl:rotate-180">→</span>
          </Link>
        </div>
      )}

      {/* Main Grid: Inputs Left, Result Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="p-5 sm:p-6 space-y-5">
            {/* Input 1: Contract Monthly Wage (Actual wage) */}
            <div>
              <NumberInput
                label={isAr ? 'الأجر الشهري الفعلي (شامل البدلات)' : 'Monthly Contract Actual Wage'}
                placeholder="10000"
                value={contractWageMonthly}
                onChange={setContractWageMonthly}
                endAdornment={currencyLabel}
                helperText={
                  isAr
                    ? '💡 نص المادة: يُحسب الاستحقاق في السعودية على الأجر الفعلي الأخير (الراتب الأساسي مضافاً إليه بدل السكن وبدل النقل والبدلات الثابتة المستمرة).'
                    : 'Statutory basis: Calculated on the last actual wage (basic salary + housing allowance + transport allowance).'
                }
              />
              <p className="mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                {isAr
                  ? 'المادة 84: أجر نصف شهر عن كل سنة من السنوات الخمس الأولى، وأجر شهر عن كل سنة تالية.'
                  : 'Article 84: Half a month wage for each of the first 5 years, and 1 month wage for each year thereafter.'}
              </p>
            </div>

            {/* Input 2: Date Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ksa-start-date"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {isAr ? 'تاريخ بداية العمل' : 'Start Date'}
                </label>
                <input
                  id="ksa-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="ksa-end-date"
                  className="text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  {isAr ? 'آخر يوم عمل (تاريخ نهاية الخدمة)' : 'Last Working Day (End Date)'}
                </label>
                <input
                  id="ksa-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
                />
              </div>
            </div>

            {/* Input 3: Separation Reason Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isAr ? 'سبب انتهاء العلاقة العمالية' : 'Reason for Separation'}
              </label>
              <SegmentedToggle
                options={[
                  {
                    value: 'termination_or_end',
                    label: isAr ? 'إنهاء من صاحب العمل أو انتهاء العقد' : 'Termination / Contract Expiry',
                  },
                  {
                    value: 'resignation',
                    label: isAr ? 'استقالة العامل' : 'Employee Resignation',
                  },
                ]}
                value={separationReason}
                onChange={(v) => setSeparationReason(v as SaudiSeparationReason)}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {separationReason === 'termination_or_end'
                  ? isAr
                    ? 'يشمل انتهاء مدة العقد محدد المدة، أو الفصل من صاحب العمل لغير أسباب المادة 80، أو التقاعد النظامي (استحقاق كامل 100% بموجب المادة 84).'
                    : 'Includes expiry of fixed-term contract, employer termination (outside Art. 80), or retirement (100% full award under Art. 84).'
                  : isAr
                    ? 'تخضع الاستقالة لشرائح المادة 85: أقل من سنتين (0%)، من سنتين إلى 5 سنوات (ثلث المكافأة)، من 5 إلى 10 سنوات (ثلثا المكافأة)، 10 سنوات فأكثر (كامل المكافأة).'
                    : 'Resignation is subject to Article 85 tiers: < 2 yrs (0%), 2 to < 5 yrs (1/3), 5 to < 10 yrs (2/3), 10+ yrs (100%).'}
              </p>
            </div>

            {/* Input 4: Article 87 Checkbox (Visible only on Resignation) */}
            {separationReason === 'resignation' && (
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isArticle87Exception}
                    onChange={(e) => setIsArticle87Exception(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <div className="text-xs text-purple-900 dark:text-purple-300">
                    <span className="font-bold">
                      {isAr
                        ? 'استثناء المادة 87: استحقاق كامل المكافأة (100%) رغم الاستقالة'
                        : 'Article 87 Statutory Exception: 100% Full Award upon Resignation'}
                    </span>
                    <p className="mt-1 text-purple-800 dark:text-purple-400 leading-relaxed text-[11px]">
                      {isAr
                        ? 'ينطبق هذا الاستثناء إذا كانت الاستقالة بسبب: ترك العاملة العمل خلال 6 أشهر من عقد زواجها أو 3 أشهر من وضعها، أو إذا ترك العامل العمل نتيجة قوة قاهرة خارجة عن إرادته.'
                        : 'Applies if resignation is due to: a female worker terminating contract within 6 months of marriage or 3 months of giving birth, or force majeure beyond the worker’s control.'}
                    </p>
                  </div>
                </label>
              </div>
            )}

            {/* Input 5: Optional Unpaid Leave & Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <NumberInput
                label={isAr ? 'أيام الإجازة بدون راتب' : 'Unpaid Leave Days'}
                placeholder="0"
                value={unpaidLeaveDays}
                onChange={setUnpaidLeaveDays}
                endAdornment={isAr ? 'يوم' : 'days'}
                helperText={isAr ? 'تُستبعد من احتساب مدة الخدمة المتصلة' : 'Deducted from continuous service'}
              />

              <NumberInput
                label={isAr ? 'ديون أو خصومات مستحقة للشركة' : 'Employer Deductions / Debt'}
                placeholder="0"
                value={employerDeductions}
                onChange={setEmployerDeductions}
                endAdornment={currencyLabel}
                helperText={isAr ? 'تُخصم من صافي المكافأة قبل الصرف' : 'Subtracted directly from final payout'}
              />
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
                  {isAr ? 'صافي مكافأة نهاية الخدمة المستحقة' : 'Net End of Service Award'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {result.appliedArticle === 'Article 84'
                    ? isAr ? 'المادة 84 (كاملة)' : 'Art. 84 (Full)'
                    : result.appliedArticle === 'Article 87'
                      ? isAr ? 'استثناء المادة 87' : 'Art. 87 Exception'
                      : isAr ? `المادة 85 (${result.resignationRatioPercentage}%)` : `Art. 85 (${result.resignationRatioPercentage}%)`}
                </span>
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

              {/* Award Breakdown Table */}
              <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/40 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">
                    {isAr ? 'السنوات الخمس الأولى (أجر نصف شهر/سنة):' : 'Years 1 to 5 (0.5 month wage/yr):'}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(result.firstFiveYearsAward)} {currencyLabel}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                  <span className="text-slate-600 dark:text-slate-400">
                    {isAr ? 'ما بعد الخمس سنوات (أجر شهر كامل/سنة):' : 'Years 6+ (1.0 month wage/yr):'}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(result.subsequentYearsAward)} {currencyLabel}
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 font-semibold">
                  <span className="text-emerald-900 dark:text-emerald-300">
                    {isAr ? 'المكافأة الأساسية الكاملة (المادة 84):' : 'Full Base Award (Article 84):'}
                  </span>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    {formatCurrency(result.baseAwardTotal)} {currencyLabel}
                  </span>
                </div>

                {/* Resignation Ratio if Article 85 applied */}
                {result.appliedArticle === 'Article 85' && (
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <div className="flex justify-between items-center font-bold">
                      <span>{isAr ? 'تطبيق نسبة استقالة المادة 85:' : 'Article 85 Resignation Ratio:'}</span>
                      <span>
                        {result.resignationRatio === 0
                          ? isAr ? 'لا يستحق مكافأة (0%)' : '0% (No entitlement)'
                          : result.resignationRatioPercentage === 33.33
                            ? isAr ? 'ثلث المكافأة (33.33%)' : 'One-third (33.33%)'
                            : result.resignationRatioPercentage === 66.67
                              ? isAr ? 'ثلثا المكافأة (66.67%)' : 'Two-thirds (66.67%)'
                              : isAr ? 'كامل المكافأة (100%)' : '100% Full Award'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>{isAr ? 'المبلغ بعد تطبيق النسبة:' : 'Amount after ratio:'}</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(result.awardAfterResignationRatio)} {currencyLabel}
                      </span>
                    </div>
                  </div>
                )}

                {/* Article 87 notice if applied */}
                {result.appliedArticle === 'Article 87' && (
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 text-xs">
                    <span className="font-semibold">
                      {isAr
                        ? '✓ استثناء المادة 87 مفعل: استحقاق كامل المكافأة بنسبة 100% دون تخفيض الاستقالة.'
                        : '✓ Article 87 active: 100% full award granted without resignation deduction.'}
                    </span>
                  </div>
                )}

                {/* Deductions */}
                {result.deductions > 0 && (
                  <div className="flex justify-between items-center p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
                    <span>{isAr ? 'خصومات صاحب العمل:' : 'Employer Deductions:'}</span>
                    <span className="font-bold">
                      -{formatCurrency(result.deductions)} {currencyLabel}
                    </span>
                  </div>
                )}
              </div>

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
                href="https://hrsd.gov.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 dark:text-brand-400 hover:underline font-semibold"
              >
                {isAr ? 'وزارة الموارد البشرية والتنمية الاجتماعية ↗' : 'Saudi HRSD Portal ↗'}
              </a>
            </div>
            <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
              {isAr
                ? '📌 نطاق التطبيق: تخضع هذه الحسابات لنظام العمل السعودي (مرسوم ملكي م/51 وتعديلاته) للعاملين في القطاع الخاص. لا تنطبق على موظفي الخدمة المدنية الحكومية الخاضعين لنظام التقاعد المدني، ولا على منسوبي القوات العسكرية، ولا على العمالة المنزلية ومن في حكمهم المشمولين بلائحة خاصة.'
                : 'Statutory Scope: Governed by the Saudi Labor Law (Royal Decree No. M/51 as amended) for private sector employees. Does not apply to civil service government employees under civil retirement pensions, military personnel, or domestic workers subject to individual ministerial regulations.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
