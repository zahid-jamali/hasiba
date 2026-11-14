'use client';

import React, { useState } from 'react';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';
import { Card } from '@/components/ui/Card';
import { NumberInput } from '@/components/ui/NumberInput';
import { SegmentedToggle } from '@/components/ui/SegmentedToggle';
import { ResultBox } from '@/components/ui/ResultBox';
import {
  KaratKey,
  PricesData,
  calculateMyGoldValue,
} from '@/lib/gold';

interface MyGoldValueCalculatorProps {
  locale: Locale;
  currency: string;
  currencySymbol: string;
  pricesData: PricesData;
}

export const MyGoldValueCalculator: React.FC<MyGoldValueCalculatorProps> = ({
  locale,
  currency,
  currencySymbol,
  pricesData,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';

  const [grams, setGrams] = useState<string>('20');
  const [karat, setKarat] = useState<KaratKey>('21K');
  const [makingType, setMakingType] = useState<'none' | 'fixed_per_gram' | 'percentage'>('none');
  const [makingValue, setMakingValue] = useState<string>('');

  const numGrams = parseFloat(grams) || 0;
  const numMaking = parseFloat(makingValue) || 0;

  const result = calculateMyGoldValue(
    {
      grams: numGrams,
      karat,
      currency,
      makingChargeType: makingType === 'none' ? undefined : makingType,
      makingChargeValue: numMaking,
    },
    pricesData
  );

  const shareText = isAr
    ? `قيمة الذهب لدي: ${formatDigits(result.totalValue.toLocaleString())} ${currencySymbol} (${formatDigits(result.grams)} جرام عيار ${formatDigits(result.karat)}) عبر حاسبة: https://hasiba.zetawala.com/gold-price/`
    : `My gold value: ${result.totalValue.toLocaleString()} ${currencySymbol} (${result.grams}g of ${result.karat}) calculated on Hasiba: https://hasiba.zetawala.com/en/gold-price/`;

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-7 shadow-sm border-slate-200 dark:border-slate-800 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <span>⚖️</span>
            <span>{isAr ? 'حاسبة قيمة الذهب والمصنعية' : 'My Gold Value & Making Charge Calculator'}</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isAr
              ? 'احسب القيمة الإجمالية لذهبك بالعملة المحلية مع احتساب أجور الصياغة والمصنعية الاختيارية.'
              : 'Calculate the total estimated cash value of your jewelry or bullion with optional making fees.'}
          </p>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Grams input */}
          <NumberInput
            label={isAr ? 'الوزن الإجمالي (بالجرام)' : 'Total Weight (in Grams)'}
            value={grams}
            onChange={setGrams}
            min={0.1}
            max={100000}
            step={0.1}
            placeholder={isAr ? 'مثال: 25.5' : 'e.g. 25.5'}
          />

          {/* Karat selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isAr ? 'عيار الذهب' : 'Gold Karat'}
            </label>
            <SegmentedToggle
              value={karat}
              onChange={(k) => setKarat(k as KaratKey)}
              options={[
                { value: '24K', label: '24K' },
                { value: '22K', label: '22K' },
                { value: '21K', label: '21K' },
                { value: '18K', label: '18K' },
              ]}
            />
          </div>
        </div>

        {/* Making Charge Section */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
            {isAr ? 'أجور المصنعية / الصياغة (اختياري)' : 'Making Charge / Crafting Fee (Optional)'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setMakingType('none');
                setMakingValue('');
              }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors min-h-[44px] ${
                makingType === 'none'
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {isAr ? 'بدون مصنعية (ذهب خام / سبائك)' : 'No Making Fee (Raw / Bullion)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMakingType('fixed_per_gram');
                if (!makingValue) setMakingValue('30');
              }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors min-h-[44px] ${
                makingType === 'fixed_per_gram'
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {isAr ? 'مبلغ ثابت للجرام' : 'Fixed Per Gram'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMakingType('percentage');
                if (!makingValue) setMakingValue('10');
              }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors min-h-[44px] ${
                makingType === 'percentage'
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}
            </button>
          </div>

          {makingType !== 'none' && (
            <div className="pt-2">
              <NumberInput
                label={
                  makingType === 'fixed_per_gram'
                    ? isAr
                      ? `قيمة المصنعية لكل جرام (${currencySymbol})`
                      : `Making Fee Per Gram (${currencySymbol})`
                    : isAr
                      ? 'نسبة المصنعية (%)'
                      : 'Making Fee Percentage (%)'
                }
                value={makingValue}
                onChange={setMakingValue}
                placeholder={makingType === 'percentage' ? '10' : '35'}
              />
            </div>
          )}
        </div>

        {/* Result Area */}
        <ResultBox
          title={isAr ? 'القيمة التقديرية الإجمالية' : 'Total Estimated Gold Value'}
          primaryResult={`${formatDigits(result.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} ${currencySymbol}`}
          items={[
            {
              label: isAr ? 'سعر الجرام الخام' : 'Raw Price per Gram',
              value: `${formatDigits(result.pricePerGramBase.toFixed(2))} ${currencySymbol}`,
            },
            {
              label: isAr ? 'قيمة الذهب الخام' : 'Raw Gold Value',
              value: `${formatDigits(result.rawGoldTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} ${currencySymbol}`,
            },
            {
              label: isAr ? 'إجمالي المصنعية' : 'Total Making Fee',
              value: `${formatDigits(result.makingChargeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }))} ${currencySymbol}`,
            },
            {
              label: isAr ? 'وزن الذهب الخالص (24K)' : 'Pure Gold Equivalent (24K)',
              value: `${formatDigits(result.pureGoldWeightGrams.toFixed(2))} ${isAr ? 'جرام' : 'g'}`,
            },
          ]}
          shareMessage={shareText}
          locale={locale}
        />
      </Card>
    </div>
  );
};
