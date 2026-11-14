'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toArabicDigits, toWesternDigits } from '@/lib/digits';
import { Locale } from '@/i18n/types';

export type DigitsType = 'western' | 'arabic';

interface DigitsContextValue {
  digitsType: DigitsType;
  setDigitsType: (type: DigitsType) => void;
  formatDigits: (value: string | number) => string;
}

const STORAGE_KEY = 'hasiba_digits_pref';

const DigitsContext = createContext<DigitsContextValue>({
  digitsType: 'western',
  setDigitsType: () => {},
  formatDigits: (v) => String(v),
});

export const DigitsProvider: React.FC<{
  children: React.ReactNode;
  locale: Locale;
}> = ({ children, locale }) => {
  const [digitsType, setDigitsTypeState] = useState<DigitsType>('western');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'arabic' || saved === 'western') {
        setDigitsTypeState(saved);
      }
    } catch {
      // Ignore localStorage access failures (e.g. private browsing)
    }
  }, []);

  const setDigitsType = (type: DigitsType) => {
    setDigitsTypeState(type);
    try {
      localStorage.setItem(STORAGE_KEY, type);
    } catch {
      // Ignore write errors
    }
  };

  const formatDigits = (value: string | number): string => {
    if (value === undefined || value === null) return '';
    const str = String(value);
    if (digitsType === 'arabic' && locale === 'ar') {
      return toArabicDigits(str);
    }
    return toWesternDigits(str);
  };

  return (
    <DigitsContext.Provider value={{ digitsType, setDigitsType, formatDigits }}>
      {children}
    </DigitsContext.Provider>
  );
};

export const useDigits = () => useContext(DigitsContext);
