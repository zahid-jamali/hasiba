'use client';

import React from 'react';
import { Select } from './Select';
import { Locale, MonthOption } from '@/i18n/types';
import { getDictionary } from '@/i18n';

export interface DateFieldsProps {
  calendarType: 'hijri' | 'gregorian';
  day: number | string;
  month: number | string;
  year: number | string;
  onDayChange: (day: number) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  locale: Locale;
  label?: string;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export const DateFields: React.FC<DateFieldsProps> = ({
  calendarType,
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  locale,
  label,
  minYear,
  maxYear,
  className = '',
}) => {
  const t = getDictionary(locale);

  // Month list depending on calendar
  const months: MonthOption[] =
    calendarType === 'hijri' ? t.months.hijri : t.months.gregorian;

  // Max days in month (Hijri is 30, Gregorian is 31)
  const maxDays = calendarType === 'hijri' ? 30 : 31;
  const dayOptions = Array.from({ length: maxDays }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  // Year range defaults
  const currentHijriYear = 1446;
  const currentGregorianYear = new Date().getFullYear();

  const defaultMinYear =
    minYear ?? (calendarType === 'hijri' ? 1340 : 1920);
  const defaultMaxYear =
    maxYear ??
    (calendarType === 'hijri' ? currentHijriYear + 5 : currentGregorianYear + 5);

  const yearOptions = Array.from(
    { length: defaultMaxYear - defaultMinYear + 1 },
    (_, i) => {
      const y = defaultMaxYear - i;
      return { value: y, label: String(y) };
    }
  );

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </span>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {/* Day Select */}
        <Select
          label={t.ui.day}
          options={dayOptions}
          value={day}
          onChange={(e) => onDayChange(Number(e.target.value))}
        />

        {/* Month Select */}
        <Select
          label={t.ui.month}
          options={months.map((m) => ({ value: m.value, label: m.label }))}
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
        />

        {/* Year Select */}
        <Select
          label={t.ui.year}
          options={yearOptions}
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};
