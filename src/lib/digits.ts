/**
 * Utility functions for digit conversion between Arabic-Indic (٠-٩),
 * Persian/Extended Arabic-Indic (۰-۹), and Western digits (0-9).
 */

const ALL_EASTERN_DIGITS_REGEX = /[٠-٩۰-۹]/g;

/**
 * Map of Arabic-Indic and Persian characters to Western digits.
 */
const DIGIT_MAP: Record<string, string> = {
  // Arabic-Indic (U+0660 to U+0669)
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',

  // Persian / Extended Arabic-Indic (U+06F0 to U+06F9)
  '۰': '0',
  '۱': '1',
  '۲': '2',
  '۳': '3',
  '۴': '4',
  '۵': '5',
  '۶': '6',
  '۷': '7',
  '۸': '8',
  '۹': '9',
};

const WESTERN_TO_ARABIC_INDIC: string[] = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Converts any Arabic-Indic (٠-٩) and Persian (۰-۹) digits in a string to Western digits (0-9).
 * Preserves all other characters in the string.
 *
 * @param input The input string containing any digits
 * @returns String with all Eastern digits replaced with Western digits
 */
export function toWesternDigits(input: string): string {
  if (!input) return '';
  return input.replace(ALL_EASTERN_DIGITS_REGEX, (char) => DIGIT_MAP[char] || char);
}

/**
 * Converts Western digits (0-9) to Arabic-Indic digits (٠-٩).
 * Preserves all other characters.
 */
export function toArabicDigits(input: string | number): string {
  if (input === undefined || input === null) return '';
  return String(input).replace(/[0-9]/g, (char) => WESTERN_TO_ARABIC_INDIC[Number(char)] || char);
}

/**
 * Normalizes a localized number string (converting Eastern digits, Arabic decimal separator '٫' to '.',
 * and removing thousand separators '٬' or commas) for parsing.
 */
export function normalizeNumberInput(input: string): string {
  if (!input) return '';
  const western = toWesternDigits(input.trim());
  return western
    .replace(/٫/g, '.') // Arabic decimal separator
    .replace(/[٬,]/g, ''); // Arabic or Western thousands separator
}

/**
 * Safely parses a localized number string to a JavaScript number.
 * Returns NaN if input is invalid.
 */
export function parseLocalizedNumber(input: string): number {
  const normalized = normalizeNumberInput(input);
  if (!normalized) return NaN;
  return Number(normalized);
}
