import { isRTL } from '../../utils/languageConfig';
import { updateHtmlLangAttribute } from '../../utils/htmlLanguageAttributes';

describe('RTL Support', () => {
  // Save original document properties
  const originalDir = document.documentElement.dir;
  const originalLang = document.documentElement.lang;

  // Reset document properties after each test
  afterEach(() => {
    document.documentElement.dir = originalDir;
    document.documentElement.lang = originalLang;
    document.body.classList.remove('rtl');
  });

  test('isRTL should correctly identify RTL languages', () => {
    // Arabic is RTL
    expect(isRTL('ar')).toBe(true);

    // English is LTR
    expect(isRTL('en')).toBe(false);

    // French is LTR
    expect(isRTL('fr')).toBe(false);
  });

  test('isRTL should handle unknown languages', () => {
    // Unknown language should default to LTR
    expect(isRTL('unknown')).toBe(false);
  });

  test('updateHtmlLangAttribute should set correct language attribute', () => {
    // Update to English
    updateHtmlLangAttribute('en');
    expect(document.documentElement.lang).toBe('en');

    // Update to Arabic
    updateHtmlLangAttribute('ar');
    expect(document.documentElement.lang).toBe('ar');
  });

  test('updateHtmlLangAttribute should set correct direction for LTR languages', () => {
    // Update to English (LTR)
    updateHtmlLangAttribute('en');

    // Check direction
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.body.classList.contains('rtl')).toBe(false);
  });

  test('updateHtmlLangAttribute should set correct direction for RTL languages', () => {
    // Update to Arabic (RTL)
    updateHtmlLangAttribute('ar');

    // Check direction
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.body.classList.contains('rtl')).toBe(true);
  });
});
