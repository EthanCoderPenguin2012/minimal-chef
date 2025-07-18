/**
 * Utility functions for optimized translation loading
 */

import i18n from 'i18next';
import { supportedLanguages } from './languageConfig';

// Define namespaces used in the application
const namespaces = ['common', 'recipes', 'shopping', 'settings'];

/**
 * Preload translations for a specific language
 * @param language Language code to preload
 * @returns Promise that resolves when loading is complete
 */
export const preloadLanguage = async (language: string): Promise<void> => {
  try {
    await Promise.all(
      namespaces.map((ns) => i18n.loadNamespaces(ns, { lng: language }))
    );
    console.log(`Preloaded translations for ${language}`);
  } catch (error) {
    console.error(`Failed to preload translations for ${language}:`, error);
  }
};

/**
 * Preload translations for the user's language and the fallback language
 * This can be called during idle time to improve performance
 */
export const preloadUserLanguages = async (): Promise<void> => {
  const currentLanguage = i18n.language;
  const fallbackLanguage = i18n.options.fallbackLng as string;

  // Preload current language if it's not already loaded
  if (currentLanguage) {
    await preloadLanguage(currentLanguage);
  }

  // Preload fallback language if it's different from current language
  if (fallbackLanguage && fallbackLanguage !== currentLanguage) {
    await preloadLanguage(fallbackLanguage);
  }
};

/**
 * Preload translations for a language in the background
 * @param language Language code to preload
 */
export const preloadLanguageInBackground = (language: string): void => {
  // Use requestIdleCallback if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      preloadLanguage(language);
    });
  } else {
    setTimeout(() => {
      preloadLanguage(language);
    }, 1000);
  }
};

/**
 * Get the most likely languages the user might switch to
 * based on browser preferences and supported languages
 * @returns Array of language codes
 */
export const getLikelyLanguages = (): string[] => {
  const currentLanguage = i18n.language;
  const result: string[] = [];

  // Add languages from navigator.languages if available
  if (navigator.languages) {
    navigator.languages.forEach((lang) => {
      const code = lang.split('-')[0];
      if (
        code !== currentLanguage &&
        supportedLanguages.some((l) => l.code === code) &&
        !result.includes(code)
      ) {
        result.push(code);
      }
    });
  }

  // Add all supported languages that aren't already included
  supportedLanguages.forEach((lang) => {
    if (lang.code !== currentLanguage && !result.includes(lang.code)) {
      result.push(lang.code);
    }
  });

  return result;
};

/**
 * Preload likely languages in the background during idle time
 * This improves performance when the user switches languages
 */
export const preloadLikelyLanguages = (): void => {
  const likelyLanguages = getLikelyLanguages();

  // Preload first likely language immediately
  if (likelyLanguages.length > 0) {
    preloadLanguageInBackground(likelyLanguages[0]);
  }

  // Preload other likely languages with increasing delays
  likelyLanguages.slice(1).forEach((lang, index) => {
    setTimeout(
      () => {
        preloadLanguageInBackground(lang);
      },
      (index + 1) * 5000
    ); // 5 seconds between each preload
  });
};

/**
 * Initialize optimized translation loading
 * Call this function once during application startup
 */
export const initOptimizedTranslationLoading = (): void => {
  // Preload current language and fallback language
  preloadUserLanguages();

  // Preload likely languages in the background
  setTimeout(() => {
    preloadLikelyLanguages();
  }, 3000); // Wait 3 seconds before preloading other languages

  // Add event listener for language changes
  i18n.on('languageChanged', (newLanguage) => {
    // Preload namespaces for the new language
    namespaces.forEach((ns) => {
      i18n.loadNamespaces(ns, { lng: newLanguage });
    });
  });
};
