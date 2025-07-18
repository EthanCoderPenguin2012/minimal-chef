import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {
  updateHtmlLangAttribute,
  initializeHtmlLangAttribute,
} from './utils/htmlLanguageAttributes';
import { initOptimizedTranslationLoading } from './utils/translationLoader';
import { initA11yLanguageSupport } from './utils/a11yLanguageUtils';
import { initMetadataUpdates } from './utils/metadataUtils';

// Initialize i18next
i18n
  // Load translations using http backend
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: 'en',
    // Debug mode in development environment
    debug: process.env.NODE_ENV === 'development',
    // Namespaces configuration
    ns: ['common', 'recipes', 'shopping', 'settings'],
    defaultNS: 'common',
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Detection options
    detection: {
      // Order of language detection
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Cache language detection in localStorage
      caches: ['localStorage'],
    },
    // Backend configuration
    backend: {
      // Path to load resources with minified version for production
      loadPath:
        process.env.NODE_ENV === 'production'
          ? '/locales/{{lng}}/{{ns}}.min.json'
          : '/locales/{{lng}}/{{ns}}.json',
      // Add cache control for production
      queryStringParams:
        process.env.NODE_ENV === 'production'
          ? { v: process.env.REACT_APP_VERSION || '1.0.0' }
          : {},
      // Add crossDomain support
      crossDomain: true,
    },
    // Add caching options
    load: 'currentOnly', // Only load the specific language requested (not all)
    // Optimize bundle size by not including all translations in the bundle
    partialBundledLanguages: true,
    // React configuration
    react: {
      useSuspense: true,
    },
  });

// Initialize HTML language attributes with the current language
i18n.on('initialized', () => {
  initializeHtmlLangAttribute(i18n.language);

  // Initialize optimized translation loading
  initOptimizedTranslationLoading();

  // Initialize accessibility features for multi-language support
  initA11yLanguageSupport(i18n);

  // Initialize metadata updates
  initMetadataUpdates(i18n);
});

// Update HTML language attributes when the language changes
i18n.on('languageChanged', (lng) => {
  updateHtmlLangAttribute(lng);
});

export default i18n;
