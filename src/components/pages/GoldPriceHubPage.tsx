'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';
import { Card } from '@/components/ui/Card';
import {
  PricesData,
  GOLD_COUNTRIES,
  GoldCountryCode,
  calculateGoldPrices,
  formatPriceUpdatedAt,
} from '@/lib/gold';

interface GoldPriceHubPageProps {
  initialPrices: PricesData;
  locale: Locale;
}

export const GoldPriceHubPage: React.FC<GoldPriceHubPageProps> = ({
  initialPrices,
  locale,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';
  const [prices, setPrices] = useState<PricesData>(initialPrices);

  // Client-side refresh on load to guarantee freshness
  useEffect(() => {
    let isMounted = true;
    fetch('/data/prices.json')
      .then((r) => r.json())
      .then((data: PricesData) => {
        if (isMounted && data && data.xauUsdOz) {
          setPrices(data);
        }
      })
      .catch(() => {
        // Fall back to server-rendered initial prices
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const countryCodes: GoldCountryCode[] = [
    'sa',
    'ae',
    'eg',
    'kw',
    'qa',
    'jo',
    'iq',
    'om',
    'bh',
    'ma',
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Live Badge & Timestamp Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isAr ? 'أسعار الذهب والفضة اللحظية (تحديث مباشر)' : 'Live Gold & Silver Spot Rates'}
          </span>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span>{isAr ? 'آخر تحديث: ' : 'Last updated: '}</span>
          <strong className="text-slate-700 dark:text-slate-300">
            {formatPriceUpdatedAt(prices.updatedAt, locale)}
          </strong>
        </div>
      </div>

      {/* Country Cards Grid Selector */}
      <section aria-labelledby="countries-grid-title" className="space-y-4">
        <h2 id="countries-grid-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'اختر الدولة لمعرفة الأسعار التفصيلية والمصنعية:' : 'Select Country for Detailed Prices & Making Charges:'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {countryCodes.map((code) => {
            const country = GOLD_COUNTRIES[code];
            const countryPrices = calculateGoldPrices(prices, country.currency);
            const targetUrl = isAr ? `/gold-price/${code}/` : `/en/gold-price/${code}/`;

            return (
              <Link
                key={code}
                href={targetUrl}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    {country.currency}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-1 group-hover:text-brand-600 transition-colors">
                    {country.name[locale]}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isAr ? 'عيار 21:' : '21K Gram:'}
                  </div>
                  <div className="text-base font-black text-slate-950 dark:text-slate-100">
                    {formatDigits(countryPrices['21K'].toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 }))}{' '}
                    <span className="text-xs font-normal text-slate-500">{country.currencySymbol[locale]}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Summary Table: 21K and 24K per gram for all countries */}
      <section aria-labelledby="summary-table-title" className="space-y-4">
        <h2 id="summary-table-title" className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {isAr ? 'جدول مقارنة أسعار الذهب اليوم في الدول العربية' : 'Comparative Gold Prices Across Arab Countries'}
        </h2>

        <Card className="overflow-hidden shadow-sm border-slate-200 dark:border-slate-800 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 text-xs font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th scope="col" className="py-3 px-4 text-start">{isAr ? 'الدولة' : 'Country'}</th>
                  <th scope="col" className="py-3 px-4 text-start">{isAr ? 'العملة' : 'Currency'}</th>
                  <th scope="col" className="py-3 px-4 text-start">{isAr ? 'عيار 24 (للجرام)' : '24K (per gram)'}</th>
                  <th scope="col" className="py-3 px-4 text-start">{isAr ? 'عيار 21 (للجرام)' : '21K (per gram)'}</th>
                  <th scope="col" className="py-3 px-4 text-start">{isAr ? 'عيار 18 (للجرام)' : '18K (per gram)'}</th>
                  <th scope="col" className="py-3 px-4 text-center">{isAr ? 'التفاصيل' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs sm:text-sm">
                {countryCodes.map((code) => {
                  const country = GOLD_COUNTRIES[code];
                  const countryPrices = calculateGoldPrices(prices, country.currency);
                  const targetUrl = isAr ? `/gold-price/${code}/` : `/en/gold-price/${code}/`;

                  return (
                    <tr key={code} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-slate-100">
                        <Link href={targetUrl} className="hover:text-brand-600 underline-offset-2 hover:underline">
                          {country.name[locale]}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-slate-600 dark:text-slate-400">
                        {country.currency}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {formatDigits(countryPrices['24K'].toFixed(2))}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-700 dark:text-amber-400">
                        {formatDigits(countryPrices['21K'].toFixed(2))}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {formatDigits(countryPrices['18K'].toFixed(2))}
                      </td>
                      <td className="py-3.5 px-4 text-center font-sans">
                        <Link
                          href={targetUrl}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors min-h-[36px]"
                        >
                          {isAr ? 'سعر اليوم ←' : 'Today’s Price →'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Mandatory Attribution & Market Notice */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
        <p>
          <strong className="text-slate-700 dark:text-slate-300">
            {isAr ? 'تنويه هام حول الأسعار:' : 'Important Price Notice:'}{' '}
          </strong>
          {isAr
            ? 'الأسعار المعروضة محسوبة بدقة على أساس السعر الفوري العالمي للأونصة وأسعار الصرف الحية. محلات الصاغة والمجوهرات تضيف أجور المصنعية والدمغة والضرائب، كما قد تختلف أسعار التداول الفعلي في بعض الأسواق المحلية (خاصة في مصر) بناءً على قوى العرض والطلب وسعر الصرف الموازي.'
            : 'Prices shown are calculated from international gold spot rates and live exchange rates. Retail jewelry shops apply making charges, hallmark fees, and local taxes. Actual retail prices in local markets (notably Egypt) may vary based on market supply and currency premiums.'}
        </p>
        <p>
          <span>{isAr ? 'بيانات أسعار الصرف مقدمة من: ' : 'Currency exchange rates provided by: '}</span>
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
    </div>
  );
};
