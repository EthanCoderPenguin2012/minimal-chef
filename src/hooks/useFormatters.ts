import { useTranslation } from 'react-i18next';
import {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatPercent,
  formatCurrency,
  formatUnit,
  formatList,
} from '../utils/formatters';

/**
 * Hook that provides locale-aware formatting functions
 * Uses the current language from i18next
 */
export const useFormatters = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return {
    /**
     * Format a date according to the current locale
     * @param date Date to format
     * @param options Intl.DateTimeFormatOptions
     */
    formatDate: (
      date: Date | string | number,
      options?: Intl.DateTimeFormatOptions
    ) => formatDate(date, locale, options),

    /**
     * Format a date as a relative time (e.g., "2 days ago", "in 3 hours")
     * @param date Date to format
     */
    formatRelativeTime: (date: Date | string | number) =>
      formatRelativeTime(date, locale),

    /**
     * Format a number according to the current locale
     * @param number Number to format
     * @param options Intl.NumberFormatOptions
     */
    formatNumber: (number: number, options?: Intl.NumberFormatOptions) =>
      formatNumber(number, locale, options),

    /**
     * Format a number as a percentage
     * @param number Number to format as percentage (e.g., 0.25 for 25%)
     * @param options Intl.NumberFormatOptions
     */
    formatPercent: (number: number, options?: Intl.NumberFormatOptions) =>
      formatPercent(number, locale, options),

    /**
     * Format a number as currency
     * @param amount Amount to format
     * @param currency Currency code (e.g., 'USD', 'EUR')
     * @param options Intl.NumberFormatOptions
     */
    formatCurrency: (
      amount: number,
      currency?: string,
      options?: Intl.NumberFormatOptions
    ) => formatCurrency(amount, locale, currency, options),

    /**
     * Format a unit value (e.g., "5 kilograms", "3 liters")
     * @param value Value to format
     * @param unit Unit to use (e.g., 'kilogram', 'liter')
     * @param options Intl.NumberFormatOptions
     */
    formatUnit: (
      value: number,
      unit: string,
      options?: Intl.NumberFormatOptions
    ) => formatUnit(value, locale, unit, options),

    /**
     * Format a list of items according to the current locale
     * @param items Array of items to format
     * @param options Intl.ListFormatOptions
     */
    formatList: (items: string[], options?: Intl.ListFormatOptions) =>
      formatList(items, locale, options),

    /**
     * Get the current locale
     */
    locale,
  };
};

export default useFormatters;
