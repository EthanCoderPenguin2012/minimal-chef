import { isRTL } from './languageConfig';

/**
 * Updates the HTML document language attributes based on the selected language
 * @param languageCode The language code to set
 */
export const updateHtmlLangAttribute = (languageCode: string): void => {
  // Update the lang attribute on the html element
  document.documentElement.setAttribute('lang', languageCode);

  // Update the dir attribute based on whether the language is RTL or LTR
  const direction = isRTL(languageCode) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', direction);

  // Add or remove the rtl class on the body element for additional styling hooks
  if (isRTL(languageCode)) {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }

  // Add CSS variables for direction that can be used in CSS
  document.documentElement.style.setProperty('--text-direction', direction);
  document.documentElement.style.setProperty(
    '--opposite-direction',
    direction === 'rtl' ? 'ltr' : 'rtl'
  );

  // Update meta tags for SEO and accessibility
  updateMetaTags(languageCode, direction);

  // Log language change in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log(`Language changed to: ${languageCode} (${direction})`);
  }
};

/**
 * Updates meta tags related to language and direction
 * @param languageCode The language code
 * @param direction The text direction (rtl or ltr)
 */
const updateMetaTags = (
  languageCode: string,
  direction: 'rtl' | 'ltr'
): void => {
  // Update or create the language meta tag
  let languageMeta = document.querySelector('meta[name="language"]');
  if (!languageMeta) {
    languageMeta = document.createElement('meta');
    languageMeta.setAttribute('name', 'language');
    document.head.appendChild(languageMeta);
  }
  languageMeta.setAttribute('content', languageCode);

  // Update or create the content-language meta tag
  let contentLanguageMeta = document.querySelector(
    'meta[http-equiv="content-language"]'
  );
  if (!contentLanguageMeta) {
    contentLanguageMeta = document.createElement('meta');
    contentLanguageMeta.setAttribute('http-equiv', 'content-language');
    document.head.appendChild(contentLanguageMeta);
  }
  contentLanguageMeta.setAttribute('content', languageCode);
};

/**
 * Initializes the HTML document language attributes based on the current language
 * @param languageCode The current language code
 */
export const initializeHtmlLangAttribute = (languageCode: string): void => {
  // Apply all language attributes
  updateHtmlLangAttribute(languageCode);

  // Add event listener for theme changes to ensure RTL styles are preserved
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class' &&
        document.documentElement.getAttribute('dir') === 'rtl'
      ) {
        // Ensure RTL class is preserved when theme changes
        document.body.classList.add('rtl');
      }
    });
  });

  // Start observing the document body for class changes
  observer.observe(document.body, { attributes: true });
};
