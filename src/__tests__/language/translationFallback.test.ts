import { translate, hasTranslation } from '../../utils/translationUtils';
import i18n from 'i18next';

// Mock i18next
jest.mock('i18next', () => ({
  t: jest.fn((key, options) => {
    // Simulate translation behavior
    const translations: Record<string, string> = {
      'common.greeting': 'Hello',
      'common.farewell': 'Goodbye',
    };

    // Return translation if it exists, otherwise return the key
    return translations[key] || key;
  }),
  exists: jest.fn((key) => {
    // Simulate exists behavior
    const translations = ['common.greeting', 'common.farewell'];
    return translations.includes(key);
  }),
}));

describe('Translation Fallback', () => {
  beforeEach(() => {
    // Clear mock calls
    jest.clearAllMocks();
  });

  test('translate should return translation when available', () => {
    const result = translate('common.greeting', 'Fallback Greeting');

    // Should return the translation
    expect(result).toBe('Hello');

    // Should have called i18n.t
    expect(i18n.t).toHaveBeenCalledWith('common.greeting', undefined);
  });

  test('translate should return fallback when translation is missing', () => {
    const result = translate('common.missing', 'Fallback Text');

    // Should return the fallback
    expect(result).toBe('Fallback Text');

    // Should have called i18n.t
    expect(i18n.t).toHaveBeenCalledWith('common.missing', undefined);
  });

  test('translate should pass options to i18n.t', () => {
    const options = { count: 2 };
    translate('common.greeting', 'Fallback', options);

    // Should have called i18n.t with options
    expect(i18n.t).toHaveBeenCalledWith('common.greeting', options);
  });

  test('hasTranslation should return true for existing translations', () => {
    const result = hasTranslation('common.greeting');

    // Should return true
    expect(result).toBe(true);

    // Should have called i18n.exists
    expect(i18n.exists).toHaveBeenCalledWith('common.greeting', {
      ns: undefined,
    });
  });

  test('hasTranslation should return false for missing translations', () => {
    const result = hasTranslation('common.missing');

    // Should return false
    expect(result).toBe(false);

    // Should have called i18n.exists
    expect(i18n.exists).toHaveBeenCalledWith('common.missing', {
      ns: undefined,
    });
  });

  test('hasTranslation should support namespace parameter', () => {
    hasTranslation('greeting', 'common');

    // Should have called i18n.exists with namespace
    expect(i18n.exists).toHaveBeenCalledWith('greeting', { ns: 'common' });
  });
});
