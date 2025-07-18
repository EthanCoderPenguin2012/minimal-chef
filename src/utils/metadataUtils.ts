/**
 * Utility functions for updating document metadata based on the current language
 */

import { supportedLanguages } from './languageConfig';

// Define localized metadata for each language
interface LocalizedMetadata {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  keywords: string;
}

// Metadata for each supported language
const localizedMetadata: Record<string, LocalizedMetadata> = {
  en: {
    title: 'Minimal Chef - Recipe Management',
    description: 'A simple and elegant recipe management application',
    ogTitle: 'Minimal Chef - Organize Your Recipes',
    ogDescription:
      'Discover, create, and organize your favorite recipes with Minimal Chef',
    keywords: 'recipes, cooking, food, meal planning, shopping list',
  },
  es: {
    title: 'Minimal Chef - Gestión de Recetas',
    description: 'Una aplicación simple y elegante para gestionar recetas',
    ogTitle: 'Minimal Chef - Organiza Tus Recetas',
    ogDescription:
      'Descubre, crea y organiza tus recetas favoritas con Minimal Chef',
    keywords:
      'recetas, cocina, comida, planificación de comidas, lista de compras',
  },
  fr: {
    title: 'Minimal Chef - Gestion de Recettes',
    description: 'Une application simple et élégante pour gérer vos recettes',
    ogTitle: 'Minimal Chef - Organisez Vos Recettes',
    ogDescription:
      'Découvrez, créez et organisez vos recettes préférées avec Minimal Chef',
    keywords:
      "recettes, cuisine, nourriture, planification de repas, liste d'achats",
  },
  ar: {
    title: 'الطاهي البسيط - إدارة الوصفات',
    description: 'تطبيق بسيط وأنيق لإدارة الوصفات',
    ogTitle: 'الطاهي البسيط - نظم وصفاتك',
    ogDescription: 'اكتشف وأنشئ ونظم وصفاتك المفضلة مع الطاهي البسيط',
    keywords: 'وصفات, طبخ, طعام, تخطيط وجبات, قائمة تسوق',
  },
};

/**
 * Update document metadata based on the current language
 * @param languageCode The current language code
 */
export const updateDocumentMetadata = (languageCode: string): void => {
  // Get metadata for the current language, fallback to English
  const metadata = localizedMetadata[languageCode] || localizedMetadata.en;

  // Update document title
  document.title = metadata.title;

  // Update meta description
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', metadata.description);
  }

  // Update Open Graph meta tags
  const ogTitleMeta = document.querySelector('meta[property="og:title"]');
  if (ogTitleMeta) {
    ogTitleMeta.setAttribute('content', metadata.ogTitle);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:title');
    meta.setAttribute('content', metadata.ogTitle);
    document.head.appendChild(meta);
  }

  const ogDescriptionMeta = document.querySelector(
    'meta[property="og:description"]'
  );
  if (ogDescriptionMeta) {
    ogDescriptionMeta.setAttribute('content', metadata.ogDescription);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:description');
    meta.setAttribute('content', metadata.ogDescription);
    document.head.appendChild(meta);
  }

  // Update keywords meta tag
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  if (keywordsMeta) {
    keywordsMeta.setAttribute('content', metadata.keywords);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute('name', 'keywords');
    meta.setAttribute('content', metadata.keywords);
    document.head.appendChild(meta);
  }

  // Update language meta tag
  const languageMeta = document.querySelector(
    'meta[http-equiv="Content-Language"]'
  );
  if (languageMeta) {
    languageMeta.setAttribute('content', languageCode);
  } else {
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Content-Language');
    meta.setAttribute('content', languageCode);
    document.head.appendChild(meta);
  }
};

/**
 * Initialize metadata updates when language changes
 * @param i18n The i18next instance
 */
export const initMetadataUpdates = (i18n: any): void => {
  // Update metadata when language changes
  i18n.on('languageChanged', (lng: string) => {
    updateDocumentMetadata(lng);
  });

  // Initial update
  updateDocumentMetadata(i18n.language);
};
