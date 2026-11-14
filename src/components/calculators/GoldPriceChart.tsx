'use client';

import React from 'react';
import { Locale } from '@/i18n/types';
import { useDigits } from '@/context/DigitsContext';

export interface HistoryPoint {
  date: string;
  price: number;
}

interface GoldPriceChartProps {
  data: HistoryPoint[];
  currencySymbol: string;
  locale: Locale;
  label?: string;
}

export const GoldPriceChart: React.FC<GoldPriceChartProps> = ({
  data,
  currencySymbol,
  locale,
  label,
}) => {
  const { formatDigits } = useDigits();
  const isAr = locale === 'ar';

  if (!data || data.length < 2) {
    return (
      <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        {isAr ? 'بيانات الرسم البياني قيد التحديث...' : 'Historical chart data updating...'}
      </div>
    );
  }

  // Calculate min and max for chart scaling
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Chart SVG dimensions
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 40;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingTop - paddingBottom;

  // Generate SVG coordinates
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * plotWidth;
    const y = paddingTop + plotHeight - ((d.price - minPrice) / priceRange) * plotHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, curr, index) => {
    return `${acc} ${index === 0 ? 'M' : 'L'} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }, '');

  // Closed area path for gradient fill
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaD = `${pathD} L ${lastPoint.x.toFixed(1)} ${(paddingTop + plotHeight).toFixed(1)} L ${firstPoint.x.toFixed(1)} ${(paddingTop + plotHeight).toFixed(1)} Z`;

  // Start vs End price change
  const startPrice = points[0].price;
  const endPrice = points[points.length - 1].price;
  const changeVal = endPrice - startPrice;
  const changePct = (changeVal / startPrice) * 100;
  const isPositive = changeVal >= 0;

  // Sample 4 dates for X-axis labels
  const step = Math.floor(data.length / 3);
  const dateLabels = [
    data[0].date.slice(5),
    data[step].date.slice(5),
    data[step * 2].date.slice(5),
    data[data.length - 1].date.slice(5),
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {label || (isAr ? 'حركة سعر الذهب خلال آخر 30 يوماً' : '30-Day Gold Price Trend')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isAr ? 'عيار 24 للجرام بالعملة المحلية' : '24K per gram in local currency'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
            }`}
          >
            {isPositive ? '▲ +' : '▼ '}
            {formatDigits(Math.abs(changePct).toFixed(2))}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({formatDigits(endPrice.toFixed(2))} {currencySymbol})
          </span>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
          aria-label={isAr ? 'رسم بياني لسعر الذهب' : 'Gold price trend chart'}
        >
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines and Y-axis values */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />
          <text
            x={isAr ? width - paddingX : paddingX}
            y={paddingTop - 6}
            textAnchor={isAr ? 'end' : 'start'}
            className="text-[10px] fill-slate-400 font-mono"
          >
            {formatDigits(maxPrice.toFixed(1))} {currencySymbol}
          </text>

          <line
            x1={paddingX}
            y1={paddingTop + plotHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + plotHeight / 2}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeDasharray="4 4"
          />

          <line
            x1={paddingX}
            y1={paddingTop + plotHeight}
            x2={width - paddingX}
            y2={paddingTop + plotHeight}
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
          />
          <text
            x={isAr ? width - paddingX : paddingX}
            y={paddingTop + plotHeight + 15}
            textAnchor={isAr ? 'end' : 'start'}
            className="text-[10px] fill-slate-400 font-mono"
          >
            {formatDigits(minPrice.toFixed(1))} {currencySymbol}
          </text>

          {/* Gradient area */}
          <path d={areaD} fill="url(#goldGradient)" />

          {/* Price line */}
          <path
            d={pathD}
            fill="none"
            stroke="#eab308"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* End Point Marker */}
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="4.5"
            fill="#ca8a04"
            className="stroke-white dark:stroke-slate-900"
            strokeWidth="2"
          />

          {/* X Axis Date Labels */}
          {dateLabels.map((dateStr, i) => {
            const xPos = paddingX + (i / 3) * plotWidth;
            return (
              <text
                key={dateStr}
                x={xPos}
                y={height - 8}
                textAnchor="middle"
                className="text-[10px] fill-slate-400"
              >
                {dateStr}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>
          {isAr ? 'أدنى سعر:' : '30D Low:'}{' '}
          <strong className="text-slate-700 dark:text-slate-300">
            {formatDigits(minPrice.toFixed(2))} {currencySymbol}
          </strong>
        </span>
        <span>
          {isAr ? 'أعلى سعر:' : '30D High:'}{' '}
          <strong className="text-slate-700 dark:text-slate-300">
            {formatDigits(maxPrice.toFixed(2))} {currencySymbol}
          </strong>
        </span>
      </div>
    </div>
  );
};
