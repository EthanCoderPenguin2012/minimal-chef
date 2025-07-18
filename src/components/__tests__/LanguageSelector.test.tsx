import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LanguageSelector from '../LanguageSelector';
import { LanguageProvider } from '../../contexts/LanguageContext';
import i18n from '../../i18n';
import { I18nextProvider } from 'react-i18next';

// Mock the language context
jest.mock('../../contexts/LanguageContext', () => {
  const originalModule = jest.requireActual('../../contexts/LanguageContext');

  return {
    ...originalModule,
    useLanguage: () => ({
      currentLanguage: 'en',
      changeLanguage: jest.fn(),
      languages: [
        {
          code: 'en',
          name: 'English',
          nativeName: 'English',
          direction: 'ltr',
          flag: '🇺🇸',
        },
        {
          code: 'es',
          name: 'Spanish',
          nativeName: 'Español',
          direction: 'ltr',
          flag: '🇪🇸',
        },
      ],
      isRTL: false,
      getCurrentLanguageDetails: () => ({
        code: 'en',
        name: 'English',
        nativeName: 'English',
        direction: 'ltr',
        flag: '🇺🇸',
      }),
      isLanguageLoading: false,
    }),
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>{ui}</LanguageProvider>
    </I18nextProvider>
  );
};

describe('LanguageSelector', () => {
  test('renders dropdown variant correctly', () => {
    renderWithProviders(<LanguageSelector variant="dropdown" />);
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });

  test('renders menu variant correctly', () => {
    renderWithProviders(<LanguageSelector variant="menu" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  test('renders list variant correctly', () => {
    renderWithProviders(<LanguageSelector variant="list" />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
  });

  test('renders compact variant correctly', () => {
    renderWithProviders(<LanguageSelector compact />);
    expect(screen.getByLabelText('Select language')).toBeInTheDocument();
  });

  test('shows flags when showFlags is true', () => {
    renderWithProviders(<LanguageSelector variant="list" showFlags />);
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    expect(screen.getByText('🇪🇸')).toBeInTheDocument();
  });

  test('shows native names when showNativeNames is true', () => {
    renderWithProviders(<LanguageSelector variant="list" showNativeNames />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  test('opens menu when clicked (menu variant)', async () => {
    renderWithProviders(<LanguageSelector variant="menu" />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });
});
