/**
 * Utility functions for translation management and fallback handling
 */

import i18n from 'i18next';

/**
 * Check if a translation key exists in the current language
 * @param key Translation key to check
 * @param ns Namespace (optional)
 * @returns Boolean indicating if the key exists
 */
export const hasTranslation = (key: string, ns?: string): boolean => {
  return i18n.exists(key, { ns });
};

/**
 * Get a list of missing translation keys for a given language
 * compared to the fallback language (usually English)
 * @param language Language code to check
 * @param namespaces Array of namespaces to check
 * @returns Object with missing keys grouped by namespace
 */
export const getMissingTranslations = async (
  language: string,
  namespaces: string[] = ['common', 'recipes', 'shopping', 'settings']
): Promise<Record<string, string[]>> => {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    console.warn(
      'getMissingTranslations is only available in development mode'
    );
    return {};
  }

  const fallbackLang = i18n.options.fallbackLng as string;
  const result: Record<string, string[]> = {};

  // Function to recursively find all keys in an object
  const findKeys = (obj: any, prefix = ''): string[] => {
    let keys: string[] = [];

    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        keys = [...keys, ...findKeys(obj[key], fullKey)];
      } else {
        keys.push(fullKey);
      }
    }

    return keys;
  };

  // Check each namespace
  for (const ns of namespaces) {
    try {
      // Get all resources for the fallback language
      const fallbackResources = i18n.getResourceBundle(fallbackLang, ns);
      if (!fallbackResources) continue;

      // Get all keys from the fallback language
      const allKeys = findKeys(fallbackResources);

      // Get resources for the target language
      const targetResources = i18n.getResourceBundle(language, ns);

      // Find missing keys
      const missingKeys = allKeys.filter((key) => {
        const keyParts = key.split('.');
        let current = targetResources;

        for (const part of keyParts) {
          if (!current || typeof current !== 'object') return true;
          current = current[part];
          if (current === undefined) return true;
        }

        return false;
      });

      if (missingKeys.length > 0) {
        result[ns] = missingKeys;
      }
    } catch (error) {
      console.error(`Error checking namespace ${ns}:`, error);
    }
  }

  return result;
};

/**
 * Log missing translations to the console
 * @param language Language code to check
 * @param namespaces Array of namespaces to check
 */
export const logMissingTranslations = async (
  language: string,
  namespaces?: string[]
): Promise<void> => {
  const missing = await getMissingTranslations(language, namespaces);

  if (Object.keys(missing).length === 0) {
    console.log(`✅ No missing translations found for language: ${language}`);
    return;
  }

  console.group(`🔍 Missing translations for language: ${language}`);

  for (const ns in missing) {
    console.group(`Namespace: ${ns}`);
    missing[ns].forEach((key) => console.log(`- ${key}`));
    console.groupEnd();
  }

  console.groupEnd();
};

/**
 * Create a development utility component to identify missing translations
 * This can be used in development mode to check for missing translations
 */
export const createTranslationDebugger = () => {
  // Only available in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return {
    checkMissingTranslations: async (
      language: string,
      namespaces?: string[]
    ) => {
      return logMissingTranslations(language, namespaces);
    },

    checkAllLanguages: async (namespaces?: string[]) => {
      const languages = i18n.languages.filter(
        (lang) => lang !== i18n.options.fallbackLng
      );

      for (const lang of languages) {
        await logMissingTranslations(lang, namespaces);
      }
    },
  };
};

/**
 * Enhanced translation function with fallback handling
 * @param key Translation key
 * @param fallback Fallback text if translation is missing
 * @param options Translation options
 * @returns Translated text or fallback
 */
export const translate = (
  key: string,
  fallback: string,
  options?: any
): string => {
  const translation = i18n.t(key, options);

  // If the translation is the same as the key, it means it's missing
  // In that case, return the fallback text
  if (translation === key) {
    // Log missing translation in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation for key: ${key}`);
    }
    return fallback;
  }

  return translation;
};
