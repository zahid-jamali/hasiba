'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Card } from '@/components/ui/Card';
import { AdSlot } from '@/components/ui/AdSlot';
import { DigitsPreferenceToggle } from '@/components/ui/DigitsPreferenceToggle';
import { GoldPriceChart, HistoryPoint } from '@/components/calculators/GoldPriceChart';
import { MyGoldValueCalculator } from '@/components/calculators/MyGoldValueCalculator';
import {
  PricesData,
  GOLD_COUNTRIES,
  GoldCountryCode,
  calculateGoldPrices,
  formatPriceUpdatedAt,
} from '@/lib/gold';

interface HistoryRecord {
  date: string;
  xauUsdOz: number;
  xagUsdOz: number;
  fx: Record<string, number>;
}

interface GoldPriceCountryPageProps {
  countryCode: GoldCountryCode;
  initialPrices: PricesData;
  initialHistory: HistoryRecord[];
  locale: Locale;
}

export const GoldPriceCountryPage: React.FC<GoldPriceCountryPageProps> = ({
  countryCode,
  initialPrices,
  initialHistory,
  locale,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';
  const country = GOLD_COUNTRIES[countryCode];
  const [prices, setPrices] = useState<PricesData>(initialPrices);

  // Client-side refresh for live accuracy
  useEffect(() => {
    let isMounted = true;
    fetch('/data/prices.json')
      .then((r) => r.json())
      .then((data: PricesData) => {
        if (isMounted && data && data.xauUsdOz) {
          setPrices(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const currentCountryPrices = calculateGoldPrices(prices, country.currency);

  // Prepare 30-day historical points for the chart in this country's currency
  const chartData: HistoryPoint[] = (initialHistory || []).map((h) => {
    const fxRate = h.fx?.[country.currency] ?? 1;
    const price24k = (h.xauUsdOz / 31.1035) * fxRate;
    return {
      date: h.date,
      price: Number(price24k.toFixed(2)),
    };
  });

  const breadcrumbs = [
    { label: isAr ? 'الرئيسية' : 'Home', href: isAr ? '/' : '/en/' },
    {
      label: isAr ? 'سعر الذهب اليوم' : 'Gold Price Today',
      href: isAr ? '/gold-price/' : '/en/gold-price/',
    },
    { label: country.name[locale] },
  ];

  const otherCountries = (
    Object.keys(GOLD_COUNTRIES) as GoldCountryCode[]
  ).filter((c) => c !== countryCode);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
      {/* Breadcrumbs & Digits Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Breadcrumbs items={breadcrumbs} locale={locale} />
        <DigitsPreferenceToggle locale={locale} />
      </div>

      {/* Header with Title and Timestamp */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 dark:text-white tracking-tight">
              {isAr
                ? `سعر الذهب اليوم في ${country.name[locale]} (${country.currency})`
                : `Gold Price Today in ${country.name[locale]} (${country.currency})`}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              {isAr
                ? `تحديث مباشر لأسعار الذهب عيار 24، 22، 21، 18 والأونصة والفضة في ${country.name[locale]} مع حاسبة المصنعية ورسم بياني لـ 30 يوماً.`
                : `Live updated prices for 24K, 22K, 21K, 18K gold per gram, ounce, and silver in ${country.name[locale]} with making charge calculator and 30-day chart.`}
            </p>
          </div>

          <div className="inline-flex flex-col items-start md:items-end text-xs text-slate-500 dark:text-slate-400 shrink-0 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {isAr ? 'آخر تحديث للأسعار:' : 'Last Price Update:'}
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {formatPriceUpdatedAt(prices.updatedAt, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Key Prices Grid (Above the Fold) */}
      <section aria-labelledby="key-prices-title" className="space-y-4">
        <h2 id="key-prices-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>💰</span>
          <span>{isAr ? 'أسعار الذهب الحالية للجرام:' : 'Current Gold Prices per Gram:'}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* 24K */}
          <Card className="p-4 sm:p-5 border-amber-300 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-white dark:from-slate-900 dark:to-slate-900/90 shadow-sm">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
              {isAr ? 'عيار 24 (الذهب الخالص)' : '24K Pure Gold'}
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {formatDigits(currentCountryPrices['24K'].toFixed(2))}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-sans">
              {country.currencySymbol[locale]} / {isAr ? 'جرام' : 'gram'}
            </div>
          </Card>

          {/* 22K */}
          <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {isAr ? 'عيار 22' : '22K Gold'}
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {formatDigits(currentCountryPrices['22K'].toFixed(2))}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-sans">
              {country.currencySymbol[locale]} / {isAr ? 'جرام' : 'gram'}
            </div>
          </Card>

          {/* 21K (Highlighted popular) */}
          <Card className="p-4 sm:p-5 border-brand-400 dark:border-brand-600 bg-brand-50/40 dark:bg-brand-950/20 shadow-sm ring-1 ring-brand-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wide">
                {isAr ? 'عيار 21 (الأكثر طلباً)' : '21K (Most Popular)'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500 text-white">★</span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-brand-950 dark:text-brand-100">
              {formatDigits(currentCountryPrices['21K'].toFixed(2))}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-sans">
              {country.currencySymbol[locale]} / {isAr ? 'جرام' : 'gram'}
            </div>
          </Card>

          {/* 18K */}
          <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              {isAr ? 'عيار 18' : '18K Gold'}
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-950 dark:text-white">
              {formatDigits(currentCountryPrices['18K'].toFixed(2))}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-sans">
              {country.currencySymbol[locale]} / {isAr ? 'جرام' : 'gram'}
            </div>
          </Card>
        </div>

        {/* Extra Regional Units Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Gold Ounce */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{isAr ? 'أونصة الذهب (31.1 جم)' : 'Gold Ounce (31.1g)'}</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {formatDigits(currentCountryPrices.ounce24K.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }))}{' '}
                <span className="text-xs text-slate-500">{country.currencySymbol[locale]}</span>
              </div>
            </div>
            <span className="text-xl">🏆</span>
          </div>

          {/* Egypt Gold Pound (if EGP) OR UAE Tola (if AED) OR Silver Gram */}
          {countryCode === 'eg' && currentCountryPrices.egyptianGoldPound && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  {isAr ? 'الجنيه الذهب (8 جم عيار 21)' : 'Egyptian Gold Pound (8g 21K)'}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatDigits(currentCountryPrices.egyptianGoldPound.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }))}{' '}
                  <span className="text-xs text-slate-500">{country.currencySymbol[locale]}</span>
                </div>
              </div>
              <span className="text-xl">🪙</span>
            </div>
          )}

          {countryCode === 'ae' && currentCountryPrices.uaeTola && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  {isAr ? 'تولة الذهب (11.66 جم)' : 'Gold Tola (11.6638g)'}
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatDigits(currentCountryPrices.uaeTola.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }))}{' '}
                  <span className="text-xs text-slate-500">{country.currencySymbol[locale]}</span>
                </div>
              </div>
              <span className="text-xl">⚖️</span>
            </div>
          )}

          {/* Silver Gram */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">{isAr ? 'جرام الفضة الخالصة' : 'Pure Silver per Gram'}</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {formatDigits(currentCountryPrices.silverGram.toFixed(2))}{' '}
                <span className="text-xs text-slate-500">{country.currencySymbol[locale]}</span>
              </div>
            </div>
            <span className="text-xl">🥈</span>
          </div>
        </div>
      </section>

      {/* Ad slot #1 */}
      <AdSlot minHeight={90} slotId="gold-country-top" />

      {/* 30-Day SVG Line Chart */}
      <section aria-label="30-Day Chart">
        <GoldPriceChart
          data={chartData}
          currencySymbol={country.currencySymbol[locale]}
          locale={locale}
          label={
            isAr
              ? `رسم بياني: حركة سعر الذهب في ${country.name[locale]} لآخر 30 يوماً`
              : `30-Day Gold Price Trend in ${country.name[locale]}`
          }
        />
      </section>

      {/* "My Gold Value" Calculator */}
      <section aria-label="My Gold Value Calculator">
        <MyGoldValueCalculator
          locale={locale}
          currency={country.currency}
          currencySymbol={country.currencySymbol[locale]}
          pricesData={prices}
        />
      </section>

      {/* Country Guide & Market Information */}
      <section aria-labelledby="country-guide-title" className="space-y-4">
        <h2 id="country-guide-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {isAr
            ? `دليل شراء وتداول الذهب في ${country.name[locale]}`
            : `Gold Buying & Trading Guide in ${country.name[locale]}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>🌟</span>
              <span>{isAr ? 'العيار الأكثر شعبية:' : 'Popular Karat:'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {country.marketNote[locale]}
            </p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>🔨</span>
              <span>{isAr ? 'أجور المصنعية المعتادة:' : 'Typical Making Charges:'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {country.makingChargesText[locale]}
            </p>
          </Card>

          <Card className="p-4 sm:p-5 border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>🏛️</span>
              <span>{isAr ? 'الضرائب والدمغة:' : 'VAT & Stamping Fees:'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {country.vatRateText[locale]}
            </p>
          </Card>
        </div>
      </section>

      {/* Disclaimers & Attribution */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <p>
          <strong className="text-slate-700 dark:text-slate-300">
            {isAr ? 'إخلاء مسؤولية حول التسعير:' : 'Pricing Disclaimer:'}{' '}
          </strong>
          {isAr
            ? 'تستند هذه الأسعار إلى السعر الفوري العالمي وتحديثات أسعار الصرف الرسمية. عند الشراء من محلات الصاغة، يضاف إلى السعر أجور المصنعية والدمغة وضريبة القيمة المضافة وفق أنظمة الدولة.'
            : 'Prices reflect spot gold benchmark rates and live currency conversion. Retail jewelers apply making charges, assay stamping, and applicable local VAT.'}
        </p>
        <p>
          <span>{isAr ? 'أسعار الصرف مقدمة من: ' : 'FX data provided by: '}</span>
          <a
            href="https://www.exchangerate-api.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Rates By Exchange Rate API
          </a>
        </p>
      </div>

      {/* Switch to Other Countries */}
      <section aria-labelledby="other-countries-title" className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h3 id="other-countries-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'أسعار الذهب في دول أخرى:' : 'Gold Prices in Other Countries:'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {otherCountries.map((c) => {
            const oc = GOLD_COUNTRIES[c];
            const ocUrl = isAr ? `/gold-price/${c}/` : `/en/gold-price/${c}/`;
            return (
              <Link
                key={c}
                href={ocUrl}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-brand-500 hover:text-brand-600 transition-colors min-h-[40px] flex items-center"
              >
                {oc.name[locale]} ({oc.currency})
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad slot #2 */}
      <AdSlot minHeight={90} slotId="gold-country-bottom" />
    </article>
  );
};
