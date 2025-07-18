import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage } from '../LanguageContext';

// Mock i18n
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest
        .fn()
        .mockImplementation((lang) => Promise.resolve(lang)),
    },
  }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Test component that uses the language context
const TestComponent = () => {
  const { currentLanguage, changeLanguage, languages, isRTL } = useLanguage();

  return (
    <div>
      <div data-testid="current-language">{currentLanguage}</div>
      <div data-testid="is-rtl">{isRTL.toString()}</div>
      <select
        data-testid="language-select"
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    // Reset document attributes
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  });

  it('should provide default language as English', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-language').textContent).toBe('en');
    expect(screen.getByTestId('is-rtl').textContent).toBe('false');
  });

  it('should change language when requested', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Initial state
    expect(screen.getByTestId('current-language').textContent).toBe('en');

    // Change to Spanish
    const select = screen.getByTestId('language-select');
    await act(async () => {
      userEvent.selectOptions(select, 'es');
    });

    // Wait for state update
    await waitFor(() => {
      expect(screen.getByTestId('current-language').textContent).toBe('es');
    });

    // Verify localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'es');
  });

  it('should set RTL direction for Arabic language', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Change to Arabic
    const select = screen.getByTestId('language-select');
    await act(async () => {
      userEvent.selectOptions(select, 'ar');
    });

    // Wait for state update
    await waitFor(() => {
      expect(screen.getByTestId('current-language').textContent).toBe('ar');
      expect(screen.getByTestId('is-rtl').textContent).toBe('true');
    });

    // Verify HTML attributes were updated
    expect(document.documentElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.getAttribute('lang')).toBe('ar');
  });

  it('should load language from localStorage if available', async () => {
    // Set language in localStorage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'i18nextLng') return 'fr';
      return null;
    });

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Wait for state update
    await waitFor(() => {
      expect(screen.getByTestId('current-language').textContent).toBe('fr');
    });
  });

  it('should fall back to English for unsupported languages', async () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Try to change to an unsupported language
    const { changeLanguage } = useLanguage();
    await act(async () => {
      await changeLanguage('unsupported');
    });

    // Should fall back to English
    await waitFor(() => {
      expect(screen.getByTestId('current-language').textContent).toBe('en');
    });
  });
});
