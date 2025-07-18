import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  setElementLanguage,
  preserveAccessibilityAttributes,
} from '../utils/a11yLanguageUtils';

/**
 * Hook for adding accessibility features to components with translated content
 * @returns Object with accessibility helper functions
 */
export const useA11yLanguage = () => {
  const { i18n } = useTranslation();
  const elementRef = useRef<HTMLElement | null>(null);

  // Set language attribute on the element when language changes
  useEffect(() => {
    if (elementRef.current) {
      setElementLanguage(elementRef.current, i18n.language);
    }
  }, [i18n.language]);

  return {
    /**
     * Ref to attach to the element that contains translated content
     */
    ref: elementRef,

    /**
     * Set language attribute on an element
     * @param element Element to set language on
     */
    setElementLanguage: (element: HTMLElement) => {
      setElementLanguage(element, i18n.language);
    },

    /**
     * Preserve accessibility attributes when updating content
     * @param element Element being updated
     * @param content New content
     */
    preserveA11y: (element: HTMLElement, content: string) => {
      preserveAccessibilityAttributes(element, content);
    },

    /**
     * Current language code
     */
    currentLanguage: i18n.language,

    /**
     * Whether the current language is RTL
     */
    isRTL: document.dir === 'rtl',
  };
};

export default useA11yLanguage;
