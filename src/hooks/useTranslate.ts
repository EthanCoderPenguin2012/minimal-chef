import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * Custom hook that combines react-i18next's useTranslation with our LanguageContext
 * to provide translation functionality and language management in one place.
 *
 * @param {string} namespace - The translation namespace to use (optional)
 * @returns Translation functions and language management utilities
 */
export const useTranslate = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace);
  const languageContext = useLanguage();

  return {
    // Translation function
    t,
    // i18n instance
    i18n,
    // Language management from context
    currentLanguage: languageContext.currentLanguage,
    changeLanguage: languageContext.changeLanguage,
    languages: languageContext.languages,
    isRTL: languageContext.isRTL,
  };
};

export default useTranslate;
