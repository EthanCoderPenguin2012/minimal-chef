import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Define language options interface
interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag?: string;
}

// Define supported languages
const supportedLanguages: LanguageOption[] = [
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
  // Additional languages can be added here
];

// Define context type
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  languages: LanguageOption[];
  isRTL: boolean;
  getCurrentLanguageDetails: () => LanguageOption | undefined;
  isLanguageLoading: boolean;
}

// Storage key for language preference
const LANGUAGE_STORAGE_KEY = 'i18nextLng';

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: async () => {},
  languages: supportedLanguages,
  isRTL: false,
  getCurrentLanguageDetails: () => undefined,
  isLanguageLoading: false,
});

/**
 * Detects the user's preferred language from browser settings
 * Falls back to 'en' if the detected language is not supported
 */
const detectUserLanguage = (): string => {
  // Try to get from localStorage first (for returning users)
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (
    savedLanguage &&
    supportedLanguages.some((lang) => lang.code === savedLanguage)
  ) {
    return savedLanguage;
  }

  // Try to detect from browser
  const browserLang = navigator.language.split('-')[0];
  const isSupported = supportedLanguages.some(
    (lang) => lang.code === browserLang
  );

  // Return detected language if supported, otherwise fallback to English
  return isSupported ? browserLang : 'en';
};

// Create provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    // Initialize with detected language
    return i18n.language || detectUserLanguage();
  });
  const [isRTL, setIsRTL] = useState<boolean>(false);
  const [isLanguageLoading, setIsLanguageLoading] = useState<boolean>(false);

  // Get current language details
  const getCurrentLanguageDetails = useCallback(():
    | LanguageOption
    | undefined => {
    return supportedLanguages.find((lang) => lang.code === currentLanguage);
  }, [currentLanguage]);

  // Effect to update HTML attributes when language changes
  useEffect(() => {
    const updateDocumentAttributes = () => {
      // Import the utility function dynamically to avoid circular dependencies
      import('../utils/htmlLanguageAttributes').then(
        ({ updateHtmlLangAttribute }) => {
          // Update HTML attributes using the centralized utility
          updateHtmlLangAttribute(currentLanguage);

          // Update RTL state based on current language
          const currentLangOption = getCurrentLanguageDetails();
          const isRightToLeft = currentLangOption?.direction === 'rtl';
          setIsRTL(isRightToLeft);
        }
      );

      // Store language preference in localStorage (requirement 1.3)
      try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
      } catch (error) {
        console.error(
          'Failed to save language preference to localStorage:',
          error
        );
      }
    };

    updateDocumentAttributes();
  }, [currentLanguage, getCurrentLanguageDetails]);

  // Initialize language on component mount
  useEffect(() => {
    const initializeLanguage = async () => {
      const detectedLang = detectUserLanguage();
      if (detectedLang !== currentLanguage) {
        await changeLanguage(detectedLang);
      }
    };

    initializeLanguage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to change language (requirement 1.2)
  const changeLanguage = async (lang: string): Promise<void> => {
    // Validate if language is supported
    if (!supportedLanguages.some((l) => l.code === lang)) {
      console.warn(
        `Language ${lang} is not supported. Falling back to English.`
      );
      lang = 'en';
    }

    try {
      setIsLanguageLoading(true);
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
      // Fall back to English if language change fails (requirement 1.5)
      if (lang !== 'en') {
        try {
          await i18n.changeLanguage('en');
          setCurrentLanguage('en');
        } catch (fallbackError) {
          console.error('Failed to fall back to English:', fallbackError);
        }
      }
    } finally {
      setIsLanguageLoading(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        languages: supportedLanguages,
        isRTL,
        getCurrentLanguageDetails,
        isLanguageLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook for using the language context
 * Provides access to language state and functions
 * @returns LanguageContextType
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageContext;
