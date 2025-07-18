/**
 * Accessibility utilities for multi-language support
 */

import { supportedLanguages } from './languageConfig';

/**
 * Announces a language change to screen readers
 * @param languageCode The new language code
 */
export const announceLanguageChange = (languageCode: string): void => {
  // Find the language details
  const language = supportedLanguages.find(
    (lang) => lang.code === languageCode
  );

  if (!language) return;

  // Create an ARIA live region for the announcement
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'assertive');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-atomic', 'true');

  // Hide it visually but keep it accessible to screen readers
  announcer.style.position = 'absolute';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.padding = '0';
  announcer.style.margin = '-1px';
  announcer.style.overflow = 'hidden';
  announcer.style.clipPath = 'inset(100%)'; // Modern replacement for deprecated clip
  announcer.style.whiteSpace = 'nowrap';
  announcer.style.border = '0';

  // Set the announcement text
  announcer.textContent = `Language changed to ${language.name}`;

  // Add it to the DOM
  document.body.appendChild(announcer);

  // Remove it after the announcement is made
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 3000);
};

/**
 * Sets the language attribute on an element
 * This helps screen readers pronounce content correctly
 * @param element The element to set the language on
 * @param languageCode The language code
 */
export const setElementLanguage = (
  element: HTMLElement,
  languageCode: string
): void => {
  element.setAttribute('lang', languageCode);
};

/**
 * Creates an element with the correct language attribute
 * @param tagName The HTML tag name
 * @param languageCode The language code
 * @param content The content of the element
 * @returns The created element
 */
export const createLocalizedElement = (
  tagName: string,
  languageCode: string,
  content: string
): HTMLElement => {
  const element = document.createElement(tagName);
  setElementLanguage(element, languageCode);
  element.textContent = content;
  return element;
};

/**
 * Adds language attributes to all elements with translated content
 * This should be called after the DOM is updated with new translations
 * @param rootElement The root element to start from (defaults to document.body)
 * @param languageCode The language code
 */
export const addLanguageAttributesToTranslatedContent = (
  rootElement: HTMLElement = document.body,
  languageCode: string
): void => {
  // Find all elements with data-i18n attribute
  const translatedElements = rootElement.querySelectorAll('[data-i18n]');

  translatedElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      setElementLanguage(element, languageCode);
    }
  });
};

/**
 * Preserves accessibility attributes when updating translations
 * @param element The element being updated
 * @param newContent The new content
 */
export const preserveAccessibilityAttributes = (
  element: HTMLElement,
  newContent: string
): void => {
  // Store existing accessibility attributes
  const ariaAttributes: Record<string, string> = {};

  // Get all attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr && (attr.name.startsWith('aria-') || attr.name === 'role')) {
      ariaAttributes[attr.name] = attr.value;
    }
  }

  // Update content
  element.innerHTML = newContent;

  // Restore accessibility attributes
  Object.entries(ariaAttributes).forEach(([name, value]) => {
    element.setAttribute(name, value);
  });
};

/**
 * Initialize accessibility features for multi-language support
 * @param i18n The i18next instance
 */
export const initA11yLanguageSupport = (i18n: any): void => {
  // Announce language changes
  i18n.on('languageChanged', (lng: string) => {
    announceLanguageChange(lng);

    // Add language attributes to translated content
    setTimeout(() => {
      addLanguageAttributesToTranslatedContent(document.body, lng);
    }, 0);
  });
};
