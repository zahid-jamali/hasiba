import { ar } from './ar';
import { en } from './en';
import { Locale, Dictionary } from './types';

export function getDictionary(locale: Locale): Dictionary {
  return locale === 'en' ? en : ar;
}

export * from './types';
export { ar, en };
