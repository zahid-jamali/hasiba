'use client';

import React from 'react';
import { toWesternDigits } from '@/lib/digits';

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onChange?: (value: string) => void;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      id,
      label,
      error,
      helperText,
      value,
      placeholder,
      startAdornment,
      endAdornment,
      className = '',
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Normalize Eastern digits (Arabic-Indic and Persian) to Western digits
      const rawValue = e.target.value;
      const normalized = toWesternDigits(rawValue);
      if (onChange) {
        onChange(normalized);
      }
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {startAdornment && (
            <div className="absolute start-3.5 z-10 flex items-center text-slate-500 pointer-events-none text-sm font-medium">
              {startAdornment}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            disabled={disabled}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full min-h-[44px] px-3.5 text-base rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-brand-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed ${
              startAdornment ? 'ps-11' : ''
            } ${endAdornment ? 'pe-11' : ''} ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            } ${className}`}
            {...props}
          />
          {endAdornment && (
            <div className="absolute end-3.5 z-10 flex items-center text-slate-500 pointer-events-none text-sm font-medium">
              {endAdornment}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';
