/**
 * Utility functions for locale-aware formatting of dates, numbers, and currencies
 */

/**
 * Format a date according to the current locale
 * @param date Date to format
 * @param locale Locale code (e.g., 'en-US', 'fr-FR')
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  locale: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format a date as a relative time (e.g., "2 days ago", "in 3 hours")
 * @param date Date to format
 * @param locale Locale code
 * @returns Formatted relative time string
 */
export const formatRelativeTime = (
  date: Date | string | number,
  locale: string
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(Math.floor(diffInSeconds), 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(diffInYears, 'year');
};

/**
 * Format a number according to the current locale
 * @param number Number to format
 * @param locale Locale code
 * @param options Intl.NumberFormatOptions
 * @returns Formatted number string
 */
export const formatNumber = (
  number: number,
  locale: string,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, options).format(number);
};

/**
 * Format a number as a percentage
 * @param number Number to format as percentage (e.g., 0.25 for 25%)
 * @param locale Locale code
 * @param options Intl.NumberFormatOptions
 * @returns Formatted percentage string
 */
export const formatPercent = (
  number: number,
  locale: string,
  options: Intl.NumberFormatOptions = {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }
): string => {
  return new Intl.NumberFormat(locale, options).format(number);
};

/**
 * Format a number as currency
 * @param amount Amount to format
 * @param locale Locale code
 * @param currency Currency code (e.g., 'USD', 'EUR')
 * @param options Intl.NumberFormatOptions
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string,
  currency: string = 'USD',
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(amount);
};

/**
 * Format a unit value (e.g., "5 kilograms", "3 liters")
 * @param value Value to format
 * @param locale Locale code
 * @param unit Unit to use (e.g., 'kilogram', 'liter')
 * @param options Intl.NumberFormatOptions
 * @returns Formatted unit string
 */
export const formatUnit = (
  value: number,
  locale: string,
  unit: string,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit,
    ...options,
  }).format(value);
};

/**
 * Format a list of items according to the current locale
 * @param items Array of items to format
 * @param locale Locale code
 * @param options Intl.ListFormatOptions
 * @returns Formatted list string
 */
export const formatList = (
  items: string[],
  locale: string,
  options: Intl.ListFormatOptions = { style: 'long', type: 'conjunction' }
): string => {
  return new Intl.ListFormat(locale, options).format(items);
};
