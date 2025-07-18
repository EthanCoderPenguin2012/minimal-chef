# Translation Guidelines for Minimal Chef

This document provides guidelines for translators working on the Minimal Chef application. Following these guidelines will help ensure consistency and quality across all language versions.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Translation Process](#translation-process)
3. [Language Style Guide](#language-style-guide)
4. [Technical Guidelines](#technical-guidelines)
5. [Quality Assurance](#quality-assurance)
6. [Specific Content Types](#specific-content-types)

## Getting Started

### Required Files

Each language requires the following translation files:

- `common.json` - General UI elements and common phrases
- `recipes.json` - Recipe-related terminology and UI
- `shopping.json` - Shopping list terminology and UI
- `settings.json` - Settings page content

### File Structure

Translation files use a nested JSON structure. For example:

```json
{
  "section": {
    "subsection": {
      "key": "Translated text"
    }
  }
}
```

## Translation Process

### Step 1: Understand the Context

Before translating, understand where and how the text will be used in the application. Context is provided in comments within the translation files.

### Step 2: Translate the Text

Translate only the values (right side), not the keys (left side):

```json
"save": "Save" → "save": "Guardar"
```

### Step 3: Review and Test

After translating, review your work and test it in the application if possible.

## Language Style Guide

### Tone and Voice

- **Friendly and Approachable**: Use a conversational, friendly tone
- **Clear and Concise**: Keep translations clear and to the point
- **Helpful**: Focus on being helpful rather than technical
- **Consistent**: Maintain consistent terminology throughout

### Formality Level

- Use a semi-formal tone that is friendly but professional
- Avoid slang or overly casual expressions
- For languages with formal/informal distinctions (tu/vous, du/Sie, etc.):
  - Use the informal form for direct user instructions
  - Use the formal form for general information or legal content

### Brand Terms

The following terms should not be translated:

- "Minimal Chef" (app name)

### Terminology Consistency

Use consistent translations for these common terms:

| English Term  | Preferred Translation    |
| ------------- | ------------------------ |
| Recipe        | [language-specific term] |
| Ingredients   | [language-specific term] |
| Shopping List | [language-specific term] |
| Settings      | [language-specific term] |

## Technical Guidelines

### Variables

Preserve variables in the text. Variables are enclosed in double curly braces:

```
"welcome": "Welcome, {{name}}!"
```

### Plurals

Handle plurals according to your language's rules. In English, we use:

```json
"itemCount": "{{count}} item",
"itemCount_plural": "{{count}} items"
```

Your language may require different plural forms. See the [i18next pluralization guide](https://www.i18next.com/translation-function/plurals) for language-specific rules.

### HTML Tags

Some strings contain HTML tags. Preserve these tags in your translation:

```
"tip": "For best results, <strong>refrigerate</strong> overnight."
```

### Special Characters

- Use proper typographic characters for your language (e.g., proper quotes, em dashes)
- Ensure all text is in UTF-8 encoding

## Quality Assurance

### Common Issues to Avoid

1. **Missing or Extra Placeholders**: Ensure all `{{variables}}` from the source are in the translation
2. **Inconsistent Terminology**: Use the same translation for recurring terms
3. **Truncated Text**: Be aware of length constraints, especially for buttons and labels
4. **Grammar and Spelling**: Check for correct grammar and spelling
5. **Punctuation**: Use appropriate punctuation for your language

### Review Process

All translations will go through the following review process:

1. Self-review by the translator
2. Peer review by another translator or native speaker
3. Technical review to ensure all variables and formatting are preserved
4. In-context testing in the application

## Specific Content Types

### Buttons and Short Labels

- Keep button text concise
- Ensure the meaning is clear even with limited context
- Consider space constraints

### Error Messages

- Be clear about what went wrong
- Be helpful about how to resolve the issue
- Maintain a friendly tone even when reporting errors

### Recipe Instructions

- Use a direct, instructional tone
- Be precise with cooking terminology
- Maintain the same step numbering as the source

### Food and Ingredient Names

- Use common, widely recognized terms for ingredients
- Consider regional variations in food terminology
- For specialized ingredients, provide the common name in your language

---

Thank you for contributing to the Minimal Chef translation project! Your work helps make the application accessible to users around the world.
