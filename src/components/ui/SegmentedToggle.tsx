'use client';

import React from 'react';

export interface ToggleOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedToggleProps<T extends string | number> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  fullWidth?: boolean;
  className?: string;
}

export function SegmentedToggle<T extends string | number>({
  options,
  value,
  onChange,
  label,
  fullWidth = true,
  className = '',
}: SegmentedToggleProps<T>) {
  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        className={`inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${
          fullWidth ? 'w-full' : ''
        }`}
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={String(opt.value)}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.value)}
              className={`flex-1 min-h-[44px] px-4 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-brand-800 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {opt.icon && <span>{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
