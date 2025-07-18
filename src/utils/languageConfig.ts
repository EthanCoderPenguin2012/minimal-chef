/**
 * Configuration for supported languages in the application
 */

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag?: string;
}

/**
 * List of supported languages in the application
 */
export const supportedLanguages: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    flag: '🇪🇸',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    flag: '🇫🇷',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
  },
];

/**
 * Get language option by code
 * @param code Language code
 * @returns Language option or undefined if not found
 */
export const getLanguageByCode = (code: string): LanguageOption | undefined => {
  return supportedLanguages.find((lang) => lang.code === code);
};

/**
 * Check if a language is RTL
 * @param code Language code
 * @returns True if the language is RTL, false otherwise
 */
export const isRTL = (code: string): boolean => {
  const language = getLanguageByCode(code);
  return language?.direction === 'rtl';
};

/**
 * Get the native name of a language
 * @param code Language code
 * @returns Native name of the language or the code if not found
 */
export const getLanguageNativeName = (code: string): string => {
  const language = getLanguageByCode(code);
  return language?.nativeName || code;
};

export default supportedLanguages;
