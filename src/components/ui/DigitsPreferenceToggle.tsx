'use client';

import React from 'react';
import { useDigits } from '@/context/DigitsContext';
import { Locale } from '@/i18n/types';
import { getDictionary } from '@/i18n';

export interface DigitsPreferenceToggleProps {
  locale: Locale;
  className?: string;
}

export const DigitsPreferenceToggle: React.FC<DigitsPreferenceToggleProps> = ({
  locale,
  className = '',
}) => {
  const { digitsType, setDigitsType } = useDigits();
  const t = getDictionary(locale);

  // Per specification: Only relevant for Arabic pages (English uses Western digits)
  if (locale !== 'ar') {
    return null;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs ${className}`}
    >
      <span className="ps-2 text-slate-500 font-medium select-none">
        {t.ui.digitsToggleLabel}
      </span>
      <div className="inline-flex rounded-lg bg-slate-200/60 dark:bg-slate-900 p-0.5" role="group">
        <button
          type="button"
          onClick={() => setDigitsType('western')}
          aria-pressed={digitsType === 'western'}
          className={`min-h-[38px] px-2.5 py-1 rounded-md font-bold transition-all select-none min-w-[44px] ${
            digitsType === 'western'
              ? 'bg-white dark:bg-slate-800 text-brand-800 dark:text-brand-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
          title={t.ui.digitsWestern}
        >
          123
        </button>
        <button
          type="button"
          onClick={() => setDigitsType('arabic')}
          aria-pressed={digitsType === 'arabic'}
          className={`min-h-[38px] px-2.5 py-1 rounded-md font-bold transition-all select-none min-w-[44px] ${
            digitsType === 'arabic'
              ? 'bg-white dark:bg-slate-800 text-brand-800 dark:text-brand-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
          title={t.ui.digitsArabic}
        >
          ١٢٣
        </button>
      </div>
    </div>
  );
};
