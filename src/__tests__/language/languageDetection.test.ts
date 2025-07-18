import { detectUserLanguage } from '../../contexts/LanguageContext';
import { supportedLanguages } from '../../utils/languageConfig';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

// Mock navigator
const navigatorMock = {
  language: 'en-US',
};

describe('Language Detection', () => {
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    Object.defineProperty(window, 'navigator', { value: navigatorMock });
    localStorageMock.clear();
  });

  test('should detect language from localStorage if available', () => {
    // Set a supported language in localStorage
    localStorageMock.setItem('i18nextLng', 'fr');

    // Detect language
    const detectedLang = detectUserLanguage();

    // Should return the language from localStorage
    expect(detectedLang).toBe('fr');
  });

  test('should ignore unsupported language in localStorage', () => {
    // Set an unsupported language in localStorage
    localStorageMock.setItem('i18nextLng', 'unsupported');

    // Mock navigator language to a supported one
    Object.defineProperty(navigatorMock, 'language', { value: 'en-US' });

    // Detect language
    const detectedLang = detectUserLanguage();

    // Should fall back to browser language
    expect(detectedLang).toBe('en');
  });

  test('should detect language from browser if not in localStorage', () => {
    // Mock navigator language
    Object.defineProperty(navigatorMock, 'language', { value: 'es-ES' });

    // Detect language
    const detectedLang = detectUserLanguage();

    // Should return the language from navigator
    expect(detectedLang).toBe('es');
  });

  test('should fall back to English for unsupported browser language', () => {
    // Mock navigator language to an unsupported one
    Object.defineProperty(navigatorMock, 'language', { value: 'unsupported' });

    // Detect language
    const detectedLang = detectUserLanguage();

    // Should fall back to English
    expect(detectedLang).toBe('en');
  });

  test('should handle language codes with region identifiers', () => {
    // Mock navigator language with region identifier
    Object.defineProperty(navigatorMock, 'language', { value: 'fr-CA' });

    // Detect language
    const detectedLang = detectUserLanguage();

    // Should extract the base language code
    expect(detectedLang).toBe('fr');
  });
});
