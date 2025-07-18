# Adding New Languages to Minimal Chef

This guide explains how to add support for a new language to the Minimal Chef application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Adding a New Language](#adding-a-new-language)
3. [Creating Translation Files](#creating-translation-files)
4. [Testing the New Language](#testing-the-new-language)
5. [RTL Language Support](#rtl-language-support)
6. [Translation Guidelines](#translation-guidelines)
7. [Common Issues](#common-issues)

## Prerequisites

Before adding a new language, make sure you have:

- Access to the project repository
- Basic understanding of JSON file format
- Knowledge of the target language
- Node.js and npm installed (for running the application)

## Adding a New Language

### Step 1: Update Language Configuration

First, add the new language to the supported languages list in `src/utils/languageConfig.ts`:

```typescript
export const supportedLanguages: LanguageOption[] = [
  // Existing languages...

  // Add your new language here
  {
    code: 'de', // Language code (ISO 639-1)
    name: 'German', // English name of the language
    nativeName: 'Deutsch', // Name of the language in the language itself
    direction: 'ltr', // Text direction: 'ltr' or 'rtl'
    flag: '🇩🇪', // Optional: Flag emoji for the language
  },
];
```

### Step 2: Create Language Directory

Create a new directory for the language in the `public/locales` folder:

```
public/locales/[language-code]/
```

For example, for German:

```
public/locales/de/
```

## Creating Translation Files

### Step 1: Create Required Translation Files

Create the following JSON files in the language directory:

1. `common.json` - Common UI elements and general phrases
2. `recipes.json` - Recipe-related translations
3. `shopping.json` - Shopping list translations
4. `settings.json` - Settings page translations

### Step 2: Translate the Content

Start by copying the English (en) translation files and translating the values (right side) while keeping the keys (left side) unchanged:

Example for `common.json`:

```json
{
  "appName": "Minimal Chef",
  "navigation": {
    "home": "Home",
    "recipes": "Recipes",
    "discover": "Discover",
    "shopping": "Shopping List",
    "settings": "Settings"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "remove": "Remove",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "back": "Back"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success!",
    "noResults": "No results found",
    "confirm": "Are you sure?",
    "yes": "Yes",
    "no": "No"
  }
}
```

### Step 3: Update Manifest.json

Add the new language to the `localized` array in `public/manifest.json`:

```json
"localized": [
  // Existing languages...

  {
    "lang": "de",
    "dir": "ltr",
    "name": "Minimal Chef - Rezeptverwaltung",
    "short_name": "Minimal Chef",
    "description": "Eine einfache und elegante Anwendung zur Rezeptverwaltung"
  }
]
```

### Step 4: Update Metadata

Add the new language to the `localizedMetadata` object in `src/utils/metadataUtils.ts`:

```typescript
const localizedMetadata: Record<string, LocalizedMetadata> = {
  // Existing languages...

  de: {
    title: 'Minimal Chef - Rezeptverwaltung',
    description: 'Eine einfache und elegante Anwendung zur Rezeptverwaltung',
    ogTitle: 'Minimal Chef - Organisieren Sie Ihre Rezepte',
    ogDescription:
      'Entdecken, erstellen und organisieren Sie Ihre Lieblingsrezepte mit Minimal Chef',
    keywords: 'Rezepte, Kochen, Essen, Mahlzeitenplanung, Einkaufsliste',
  },
};
```

## Testing the New Language

### Step 1: Run the Application

Start the development server:

```bash
npm start
```

### Step 2: Test Language Selection

1. Go to the Settings page
2. Select your new language from the language selector
3. Verify that the UI updates with the new translations

### Step 3: Test All Pages

Navigate through all pages of the application to ensure all text is properly translated:

- Home/Recipes page
- Shopping List
- Settings
- Recipe details
- Any other pages or components

### Step 4: Test Responsiveness

Test the application in different screen sizes to ensure the translations work well in all layouts.

## RTL Language Support

If you're adding a Right-to-Left (RTL) language like Arabic or Hebrew:

1. Set the `direction` property to `'rtl'` in `languageConfig.ts`
2. Set the `dir` property to `'rtl'` in `manifest.json`
3. Test thoroughly to ensure the layout adapts correctly
4. Pay special attention to:
   - Text alignment
   - Form inputs
   - Icons and buttons
   - Navigation elements

## Translation Guidelines

### General Guidelines

1. **Maintain Consistency**: Use consistent terminology throughout the translations
2. **Respect Context**: Consider the context where the text appears
3. **Keep Similar Length**: Try to keep translations similar in length to the original when possible
4. **Preserve Formatting**: Maintain any formatting placeholders like `{0}`, `{name}`, etc.
5. **Consider Space Constraints**: Be aware of UI space constraints, especially for buttons and labels

### Handling Variables

When translating text with variables, preserve the variable placeholders:

```json
"welcome": "Welcome, {{name}}!"
```

Should be translated as:

```json
"welcome": "Willkommen, {{name}}!"
```

### Handling Plurals

For plurals, use the i18next plural format:

```json
"itemCount": "{{count}} item",
"itemCount_plural": "{{count}} items"
```

Different languages may have different plural forms. Consult the [i18next pluralization documentation](https://www.i18next.com/translation-function/plurals) for language-specific plural rules.

## Common Issues

### Missing Translations

If you notice untranslated text in the UI:

1. Use the Translation Debugger in the Settings page (in development mode)
2. Check if the key exists in the appropriate translation file
3. Add any missing translations

### Text Overflow

If translated text is too long for the UI element:

1. Try to shorten the translation while preserving meaning
2. If not possible, report the issue so the UI can be adjusted

### Character Encoding

Ensure all translation files are saved with UTF-8 encoding to properly support all characters.

### Testing Tools

Use the Translation Debugger (available in development mode in the Settings page) to identify missing translations.

---

For any questions or issues with translations, please contact the development team or open an issue on the project repository.
