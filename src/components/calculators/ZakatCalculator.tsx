'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { NumberInput } from '@/components/ui/NumberInput';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import {
  calculateZakat,
  getRatesForCurrency,
  calculateMetalPrices,
  SUPPORTED_CURRENCIES,
  SupportedCurrency,
  NisabStandard,
  PricesApiResponse,
  FALLBACK_PRICES_DATA,
} from '@/lib/zakat';

interface ZakatCalculatorProps {
  locale: Locale;
}

const CURRENCY_LIST: SupportedCurrency[] = [
  'SAR',
  'AED',
  'EGP',
  'KWD',
  'QAR',
  'JOD',
  'IQD',
  'OMR',
  'BHD',
  'MAD',
  'USD',
];

export const ZakatCalculator: React.FC<ZakatCalculatorProps> = ({ locale }) => {
  const isAr = locale === 'ar';
  const { formatDigits } = useDigits();

  // Selected Currency
  const [currency, setCurrency] = useState<SupportedCurrency>('SAR');

  // Nisab Standard: 'gold' (default) or 'silver'
  const [nisabStandard, setNisabStandard] = useState<NisabStandard>('gold');

  // Live prices from /data/prices.json (or fallback)
  const [pricesData, setPricesData] = useState<PricesApiResponse>(FALLBACK_PRICES_DATA);
  const [isLoadingPrices, setIsLoadingPrices] = useState<boolean>(true);

  // Form Inputs (stored as strings for smooth user input typing)
  const [cashAtHome, setCashAtHome] = useState('');
  const [bankBalances, setBankBalances] = useState('');
  const [gold24K, setGold24K] = useState('');
  const [gold22K, setGold22K] = useState('');
  const [gold21K, setGold21K] = useState('');
  const [gold18K, setGold18K] = useState('');
  const [silverGrams, setSilverGrams] = useState('');
  const [investmentsMarketValue, setInvestmentsMarketValue] = useState('');
  const [businessStockValue, setBusinessStockValue] = useState('');
  const [moneyOwedToYou, setMoneyOwedToYou] = useState('');
  const [debtsDueNow, setDebtsDueNow] = useState('');

  // UI state for copy feedback
  const [copied, setCopied] = useState(false);

  // Fetch prices.json on client mount
  useEffect(() => {
    let isMounted = true;
    async function loadPrices() {
      try {
        const res = await fetch('/data/prices.json');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data && typeof data.xauUsdOz === 'number') {
            setPricesData(data);
          }
        }
      } catch {
        // Safe fallback already in state
      } finally {
        if (isMounted) {
          setIsLoadingPrices(false);
        }
      }
    }
    loadPrices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live metal rates for selected currency
  const metalRates = useMemo(() => {
    return getRatesForCurrency(pricesData, currency);
  }, [pricesData, currency]);

  // Live metal prices per gram
  const metalPrices = useMemo(() => {
    return calculateMetalPrices(metalRates);
  }, [metalRates]);

  // Active currency metadata
  const currConfig = SUPPORTED_CURRENCIES[currency];
  const currSymbol = isAr ? currConfig.symbolAr : currConfig.symbolEn;
  const decimals = currConfig.decimals;

  // Format currency numbers with localized digits
  const formatAmount = useCallback(
    (num: number, dec: number = decimals): string => {
      const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec,
      });
      return formatDigits(formatted);
    },
    [decimals, formatDigits]
  );

  // Perform Calculation
  const calculation = useMemo(() => {
    return calculateZakat(
      {
        cashAtHome: parseFloat(cashAtHome) || 0,
        bankBalances: parseFloat(bankBalances) || 0,
        goldGrams: {
          '24K': parseFloat(gold24K) || 0,
          '22K': parseFloat(gold22K) || 0,
          '21K': parseFloat(gold21K) || 0,
          '18K': parseFloat(gold18K) || 0,
        },
        silverGrams: parseFloat(silverGrams) || 0,
        investmentsMarketValue: parseFloat(investmentsMarketValue) || 0,
        businessStockValue: parseFloat(businessStockValue) || 0,
        moneyOwedToYou: parseFloat(moneyOwedToYou) || 0,
        debtsDueNow: parseFloat(debtsDueNow) || 0,
        nisabStandard,
      },
      metalRates
    );
  }, [
    cashAtHome,
    bankBalances,
    gold24K,
    gold22K,
    gold21K,
    gold18K,
    silverGrams,
    investmentsMarketValue,
    businessStockValue,
    moneyOwedToYou,
    debtsDueNow,
    nisabStandard,
    metalRates,
  ]);

  // Reset inputs
  const handleReset = () => {
    setCashAtHome('');
    setBankBalances('');
    setGold24K('');
    setGold22K('');
    setGold21K('');
    setGold18K('');
    setSilverGrams('');
    setInvestmentsMarketValue('');
    setBusinessStockValue('');
    setMoneyOwedToYou('');
    setDebtsDueNow('');
  };

  // Pre-fill a typical example for convenient testing
  const handleLoadExample = () => {
    setCashAtHome('15000');
    setBankBalances('60000');
    setGold21K('25');
    setInvestmentsMarketValue('20000');
    setDebtsDueNow('5000');
  };

  // Formatted share message
  const shareMessage = useMemo(() => {
    const nisabName =
      calculation.nisabStandard === 'gold'
        ? isAr
          ? `نصاب الذهب (85 جم عيار 24) = ${formatAmount(calculation.goldNisabValue)} ${currSymbol}`
          : `Gold Nisab (85g 24K) = ${formatAmount(calculation.goldNisabValue)} ${currSymbol}`
        : isAr
          ? `نصاب الفضة (595 جم) = ${formatAmount(calculation.silverNisabValue)} ${currSymbol}`
          : `Silver Nisab (595g) = ${formatAmount(calculation.silverNisabValue)} ${currSymbol}`;

    const statusText = calculation.isNisabReached
      ? isAr
        ? 'بلغ النصاب الشرعي (تجب الزكاة بعد حول كامل)'
        : 'Nisab Reached (Zakat is due after full lunar year)'
      : isAr
        ? 'دون النصاب الشرعي (لا تجب فيه الزكاة)'
        : 'Below Nisab (No Zakat Due)';

    if (isAr) {
      return `حاسبة الزكاة الشرعية - نتائج الحساب:
• العملة: ${currConfig.nameAr} (${currSymbol})
• معيار النصاب: ${nisabName}
• إجمالي الأموال الزكوية: ${formatAmount(calculation.totalAssets)} ${currSymbol}
• الديون الحالّة الواجبة الخصم: ${formatAmount(calculation.totalDeductions)} ${currSymbol}
• صافي الوعاء الزكوي: ${formatAmount(calculation.netZakatableWealth)} ${currSymbol}
• حالة النصاب: ${statusText}
• مقدار الزكاة الواجبة (2.5%): ${formatAmount(calculation.zakatDue)} ${currSymbol}

احسب زكاتك بدقة عبر حاسبة:
https://hasiba.zetawala.com/zakat-calculator/`;
    }

    return `Islamic Zakat Calculation Results:
• Currency: ${currConfig.nameEn} (${currSymbol})
• Nisab Benchmark: ${nisabName}
• Gross Zakatable Assets: ${formatAmount(calculation.totalAssets)} ${currSymbol}
• Immediate Deductible Debts: ${formatAmount(calculation.totalDeductions)} ${currSymbol}
• Net Zakatable Wealth: ${formatAmount(calculation.netZakatableWealth)} ${currSymbol}
• Status: ${statusText}
• Zakat Payable (2.5%): ${formatAmount(calculation.zakatDue)} ${currSymbol}

Calculate your Zakat accurately via Hasiba:
https://hasiba.zetawala.com/en/zakat-calculator/`;
  }, [calculation, currConfig, currSymbol, isAr, formatAmount]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareMessage);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard write failures
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Configuration Bar: Currency & Nisab Standard */}
      <Card className="bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          {/* Currency Selector */}
          <div>
            <Select
              id="zakat-currency"
              label={isAr ? 'عملة الحساب' : 'Calculation Currency'}
              value={currency}
              onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
              options={CURRENCY_LIST.map((code) => {
                const conf = SUPPORTED_CURRENCIES[code];
                return {
                  value: code,
                  label: isAr
                    ? `${conf.nameAr} (${conf.symbolAr} - ${code})`
                    : `${conf.nameEn} (${conf.symbolEn} - ${code})`,
                };
              })}
            />
          </div>

          {/* Nisab Standard Selector */}
          <div>
            <SegmentedToggle
              label={isAr ? 'معيار النصاب الشرعي' : 'Nisab Standard Benchmark'}
              value={nisabStandard}
              onChange={(val) => setNisabStandard(val as NisabStandard)}
              options={[
                {
                  value: 'gold',
                  label: isAr
                    ? `الذهب (85 جم) ~ ${formatAmount(calculation.goldNisabValue, 0)} ${currSymbol}`
                    : `Gold (85g) ~ ${formatAmount(calculation.goldNisabValue, 0)} ${currSymbol}`,
                },
                {
                  value: 'silver',
                  label: isAr
                    ? `الفضة (595 جم) ~ ${formatAmount(calculation.silverNisabValue, 0)} ${currSymbol}`
                    : `Silver (595g) ~ ${formatAmount(calculation.silverNisabValue, 0)} ${currSymbol}`,
                },
              ]}
            />
          </div>
        </div>

        {/* Live Spot Metal Rates Banner */}
        <div className="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              {isAr ? 'سعر جرام الذهب عيار 24:' : '24K Gold / Gram:'}{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {formatAmount(metalPrices.gram24K, 2)} {currSymbol}
              </strong>
            </span>
            <span>
              {isAr ? 'عيار 21:' : '21K Gold / Gram:'}{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {formatAmount(metalPrices.gram21K, 2)} {currSymbol}
              </strong>
            </span>
            <span>
              {isAr ? 'سعر جرام الفضة:' : 'Silver / Gram:'}{' '}
              <strong className="text-slate-900 dark:text-slate-200">
                {formatAmount(metalPrices.gramSilver, 2)} {currSymbol}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {isLoadingPrices
                ? isAr
                  ? 'جاري تحديث الأسعار...'
                  : 'Updating prices...'
                : isAr
                  ? 'أسعار المعادن محدثة فورياً'
                  : 'Live metal prices updated'}
            </span>
          </div>
        </div>
      </Card>

      {/* Main Grid: Form Inputs vs Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Inputs): 7 cols on large screens */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Quick actions: Pre-fill example & Reset */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isAr ? 'أدخل تفاصيل أموالك ومدخراتك' : 'Enter Your Wealth & Assets Details'}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadExample}
                className="text-xs font-semibold text-brand-700 dark:text-brand-400 hover:underline px-2.5 py-1 rounded-md hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
              >
                {isAr ? 'مثال تجريبي' : 'Sample Example'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 px-2.5 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {isAr ? 'تفريغ الحقول' : 'Clear All'}
              </button>
            </div>
          </div>

          {/* Section 1: Cash & Liquid Balances */}
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xl">💵</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {isAr ? '1. السيولة النقدية والأرصدة البنكية' : '1. Cash & Bank Deposits'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberInput
                label={isAr ? 'النقد في اليد أو الخزينة المنزلية' : 'Cash on Hand / Safe'}
                placeholder="0"
                value={cashAtHome}
                onChange={setCashAtHome}
                endAdornment={currSymbol}
                helperText={isAr ? 'السيولة النقدية المتاحة لديك' : 'Physical liquid cash'}
              />
              <NumberInput
                label={isAr ? 'الحسابات الجارية والتوفير والودائع' : 'Bank Accounts & Savings'}
                placeholder="0"
                value={bankBalances}
                onChange={setBankBalances}
                endAdornment={currSymbol}
                helperText={isAr ? 'إجمالي الأرصدة البنكية والودائع' : 'Checking, savings, and term deposits'}
              />
            </div>
          </Card>

          {/* Section 2: Gold & Silver Precious Metals */}
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xl">✨</span>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {isAr ? '2. الذهب والفضة (بالجرام)' : '2. Gold & Silver (in Grams)'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr
                    ? 'السبائك، والليرات، وحلي الادخار والاستثمار'
                    : 'Bullion, coins, and investment/savings jewelry'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <NumberInput
                label={isAr ? 'ذهب عيار 24' : 'Gold 24K'}
                placeholder="0"
                value={gold24K}
                onChange={setGold24K}
                endAdornment={isAr ? 'جم' : 'g'}
              />
              <NumberInput
                label={isAr ? 'ذهب عيار 22' : 'Gold 22K'}
                placeholder="0"
                value={gold22K}
                onChange={setGold22K}
                endAdornment={isAr ? 'جم' : 'g'}
              />
              <NumberInput
                label={isAr ? 'ذهب عيار 21' : 'Gold 21K'}
                placeholder="0"
                value={gold21K}
                onChange={setGold21K}
                endAdornment={isAr ? 'جم' : 'g'}
              />
              <NumberInput
                label={isAr ? 'ذهب عيار 18' : 'Gold 18K'}
                placeholder="0"
                value={gold18K}
                onChange={setGold18K}
                endAdornment={isAr ? 'جم' : 'g'}
              />
            </div>

            <div>
              <NumberInput
                label={isAr ? 'الفضة الخالصة (بالجرام)' : 'Pure Silver Holdings (Grams)'}
                placeholder="0"
                value={silverGrams}
                onChange={setSilverGrams}
                endAdornment={isAr ? 'جم' : 'g'}
                helperText={isAr ? 'سبائك، ليرات، وأوانٍ أو حلي فضية مدخرة' : 'Silver bars, coins, and bullion'}
              />
            </div>
          </Card>

          {/* Section 3: Investments & Business */}
          <Card>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xl">📈</span>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {isAr ? '3. الأسهم، الاستثمارات، وعروض التجارة' : '3. Investments & Commercial Inventory'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <NumberInput
                label={isAr ? 'القيمة السوقية للأسهم والصناديق' : 'Market Value of Stocks & Funds'}
                placeholder="0"
                value={investmentsMarketValue}
                onChange={setInvestmentsMarketValue}
                endAdornment={currSymbol}
                helperText={
                  isAr
                    ? 'أسهم المضاربة أو الوعاء الزكوي لأسهم الاستثمار'
                    : 'Trading shares or zakatable assets of long-term shares'
                }
              />
              <NumberInput
                label={isAr ? 'قيمة بضاعة التجارة (بسعر البيع الحالي)' : 'Business Stock (Selling Price)'}
                placeholder="0"
                value={businessStockValue}
                onChange={setBusinessStockValue}
                endAdornment={currSymbol}
                helperText={
                  isAr
                    ? 'البضائع والسلع المعدة للبيع في المتجر أو المستودع'
                    : 'Inventory and merchandise intended for resale'
                }
              />
            </div>
            <div>
              <NumberInput
                label={isAr ? 'ديون مرجوة السداد لك (لدى الآخرين)' : 'Good Debts Owed to You'}
                placeholder="0"
                value={moneyOwedToYou}
                onChange={setMoneyOwedToYou}
                endAdornment={currSymbol}
                helperText={
                  isAr
                    ? 'الأموال التي أقرضتها لشخص موثوق قادر على السداد'
                    : 'Money lent to trustworthy persons expected to pay back'
                }
              />
            </div>
          </Card>

          {/* Section 4: Deductions / Immediate Debts */}
          <Card className="border-red-200 dark:border-red-950/60 bg-red-50/20 dark:bg-red-950/10">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-100 dark:border-red-900/30">
              <span className="text-xl">📉</span>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {isAr ? '4. الخصومات: الديون الحالّة الواجبة السداد فوراً' : '4. Deductions: Immediate Debts Due Now'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr
                    ? 'تُخصم فقط الالتزامات المالية المستحقة حالاً قبل أو عند موعد إخراج الزكاة'
                    : 'Deduct only debts and immediate liabilities currently due on the Hawl date'}
                </p>
              </div>
            </div>
            <NumberInput
              label={isAr ? 'الديون والأقساط وفواتير التجارة الحالّة' : 'Immediate Due Debts & Payables'}
              placeholder="0"
              value={debtsDueNow}
              onChange={setDebtsDueNow}
              endAdornment={currSymbol}
              helperText={
                isAr
                  ? 'لا تُخصم أقساط القروض طويلة الأجل المؤجلة للسنوات القادمة'
                  : 'Long-term unmatured future installments cannot be deducted'
              }
            />
          </Card>
        </div>

        {/* Right Column (Live Results & Breakdown): 5 cols on large screens */}
        <div className="lg:col-span-5 flex flex-col gap-6 sticky top-6">
          {/* Main Result Card */}
          <div
            aria-live="polite"
            className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-slate-900 p-6 sm:p-7 shadow-md"
          >
            {/* Header / Nisab Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                {isAr ? 'مقدار الزكاة الواجب إخراجها (2.5%)' : 'Annual Zakat Due (2.5%)'}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  calculation.isNisabReached
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                }`}
              >
                {calculation.isNisabReached
                  ? isAr
                    ? 'بلغ النصاب الشرعي ✓'
                    : 'Nisab Reached ✓'
                  : isAr
                    ? 'أقل من النصاب الشرعي'
                    : 'Below Nisab Threshold'}
              </span>
            </div>

            {/* Big Primary Value */}
            <div className="flex items-baseline flex-wrap gap-2 my-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                {formatAmount(calculation.zakatDue)}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {currSymbol}
              </span>
            </div>

            {/* Quick explanation when below nisab */}
            {!calculation.isNisabReached && (
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                {isAr
                  ? `صافي ثروتك (${formatAmount(calculation.netZakatableWealth)} ${currSymbol}) لم يبلغ حد النصاب الشرعي (${formatAmount(calculation.selectedNisabValue)} ${currSymbol})، لذا لا تجب عليك الزكاة حالياً.`
                  : `Your net wealth (${formatAmount(calculation.netZakatableWealth)} ${currSymbol}) is below the required Nisab threshold (${formatAmount(calculation.selectedNisabValue)} ${currSymbol}), so no Zakat is obligated.`}
              </p>
            )}

            {/* Key Summary Figures */}
            <div className="mt-5 pt-4 border-t border-emerald-100 dark:border-emerald-900/40 space-y-2.5 text-sm">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400">
                  {isAr ? 'إجمالي الأصول الزكوية:' : 'Total Zakatable Assets:'}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {formatAmount(calculation.totalAssets)} {currSymbol}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-slate-800/50">
                <span className="text-slate-600 dark:text-slate-400">
                  {isAr ? 'الديون الحالّة المخصومة:' : 'Immediate Debts Deducted:'}
                </span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  - {formatAmount(calculation.totalDeductions)} {currSymbol}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-950/50 font-semibold">
                <span className="text-emerald-900 dark:text-emerald-300">
                  {isAr ? 'صافي الوعاء الخاضع للزكاة:' : 'Net Zakatable Wealth:'}
                </span>
                <span className="font-black text-emerald-900 dark:text-emerald-200 text-base">
                  {formatAmount(calculation.netZakatableWealth)} {currSymbol}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-slate-800/50 text-xs">
                <span className="text-slate-600 dark:text-slate-400">
                  {isAr
                    ? calculation.nisabStandard === 'gold'
                      ? 'قيمة نصاب الذهب (85 جم):'
                      : 'قيمة نصاب الفضة (595 جم):'
                    : calculation.nisabStandard === 'gold'
                      ? 'Gold Nisab Value (85g):'
                      : 'Silver Nisab Value (595g):'}
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatAmount(calculation.selectedNisabValue)} {currSymbol}
                </span>
              </div>
            </div>

            {/* 1-Click Action Buttons: Copy & WhatsApp */}
            <div className="mt-6 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/40 flex flex-wrap gap-2.5">
              <Button
                variant={copied ? 'success' : 'outline'}
                size="md"
                onClick={handleCopy}
                className="flex-1 min-w-[130px]"
              >
                {copied
                  ? isAr
                    ? '✓ تم النسخ بنجاح'
                    : '✓ Copied Details'
                  : isAr
                    ? '📋 نسخ النتيجة'
                    : '📋 Copy Result'}
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleWhatsAppShare}
                className="flex-1 min-w-[130px] bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <span>💬 {isAr ? 'مشاركة واتساب' : 'WhatsApp Share'}</span>
              </Button>
            </div>
          </div>

          {/* Asset Breakdown Card with Percentages */}
          <Card>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              {isAr ? 'توزيع الأصول الزكوية والنسب المئوية' : 'Asset Breakdown & Allocation'}
            </h3>
            {calculation.totalAssets > 0 ? (
              <div className="space-y-3">
                {calculation.assetBreakdown.map((item) => {
                  if (item.amount <= 0) return null;
                  return (
                    <div key={item.categoryKey} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {isAr ? item.labelAr : item.labelEn}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100">
                            {formatAmount(item.amount)} {currSymbol}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 w-11 text-end">
                            ({formatDigits(item.percentage.toFixed(1))}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                {isAr
                  ? 'أدخل قيم أموالك في الحقول لتظهر تفاصيل توزيع الأصول.'
                  : 'Enter your asset amounts above to view the detailed breakdown.'}
              </p>
            )}
          </Card>

          {/* Essential Scholarly & Legal Notes Callout */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>📌</span>
              <span>{isAr ? 'تنبيهات وأحكام فقهية هامة:' : 'Important Islamic & Legal Notes:'}</span>
            </div>
            <ul className="list-disc ps-4 space-y-1">
              <li>
                {isAr
                  ? 'شرط الحول: تجب الزكاة بعد مرور عام هجري كامل (354 يوماً) على امتلاك النصاب دون انقطاع.'
                  : 'Hawl Requirement: Zakat becomes due only after one full lunar year (354 days) has elapsed with your wealth continuously remaining above Nisab.'}
              </li>
              <li>
                {isAr
                  ? 'هذه الحاسبة أداة إرشادية وحسابية عامة؛ في الحالات الاستثمارية المعقدة أو التركات يُستحسن استفتاء جهة إفتاء موثوقة.'
                  : 'This calculator is a general computational guide. For complex estates, trust funds, or ambiguous debts, please consult a certified Islamic scholar.'}
              </li>
              <li>
                {isAr
                  ? 'في المملكة العربية السعودية، تخضع زكاة الشركات والأنشطة التجارية والتراخيص للوائح المستقلة الصادرة عن هيئة الزكاة والضريبة والجمارك (ZATCA).'
                  : 'In the Kingdom of Saudi Arabia, corporate and commercial enterprise zakat is regulated separately under ZATCA (Zakat, Tax and Customs Authority) guidelines.'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
