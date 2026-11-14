import { Locale } from '@/i18n/types';
import { ToolContent } from './types';

// Arabic content modules
import arHijriDateToday from './ar/hijri-date-today';
import arHijriConverter from './ar/hijri-converter';
import arAgeCalculator from './ar/age-calculator';
import arGoldPrice from './ar/gold-price';
import arZakatCalculator from './ar/zakat-calculator';
import arEndOfService from './ar/end-of-service';
import arPregnancyCalculator from './ar/pregnancy-calculator';

// English content modules
import enHijriDateToday from './en/hijri-date-today';
import enHijriConverter from './en/hijri-converter';
import enAgeCalculator from './en/age-calculator';
import enGoldPrice from './en/gold-price';
import enZakatCalculator from './en/zakat-calculator';
import enEndOfService from './en/end-of-service';
import enPregnancyCalculator from './en/pregnancy-calculator';

const contentMap: Record<Locale, Record<string, ToolContent>> = {
  ar: {
    'hijri-date-today': arHijriDateToday,
    'hijri-converter': arHijriConverter,
    'age-calculator': arAgeCalculator,
    'gold-price': arGoldPrice,
    'zakat-calculator': arZakatCalculator,
    'end-of-service': arEndOfService,
    'pregnancy-calculator': arPregnancyCalculator,
  },
  en: {
    'hijri-date-today': enHijriDateToday,
    'hijri-converter': enHijriConverter,
    'age-calculator': enAgeCalculator,
    'gold-price': enGoldPrice,
    'zakat-calculator': enZakatCalculator,
    'end-of-service': enEndOfService,
    'pregnancy-calculator': enPregnancyCalculator,
  },
};

export function getToolContent(slug: string, locale: Locale): ToolContent | null {
  return contentMap[locale]?.[slug] || null;
}

export * from './types';
