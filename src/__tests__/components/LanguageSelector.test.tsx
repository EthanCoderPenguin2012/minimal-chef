import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSelector from '../../components/LanguageSelector';
import { supportedLanguages } from '../../utils/languageConfig';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
}));

describe('LanguageSelector Component', () => {
  test('renders language selector button', () => {
    render(<LanguageSelector />);

    // Should render a button with the current language
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Should contain the language name
    const currentLanguage = supportedLanguages.find(
      (lang) => lang.code === 'en'
    );
    expect(button).toHaveTextContent(currentLanguage?.name || 'English');
  });

  test('opens menu when clicked', () => {
    render(<LanguageSelector />);

    // Click the button
    fireEvent.click(screen.getByRole('button'));

    // Menu should be open
    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    // Should show all supported languages
    supportedLanguages.forEach((language) => {
      expect(screen.getByText(language.name)).toBeInTheDocument();
    });
  });

  test('calls changeLanguage when a language is selected', () => {
    const { i18n } = require('react-i18next').useTranslation();
    render(<LanguageSelector />);

    // Click the button to open the menu
    fireEvent.click(screen.getByRole('button'));

    // Click on a language
    fireEvent.click(screen.getByText('Français'));

    // Should call changeLanguage with the selected language code
    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
  });

  test('renders compact version when compact prop is true', () => {
    render(<LanguageSelector compact />);

    // Should render an icon button
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    // Should not show the language name
    const currentLanguage = supportedLanguages.find(
      (lang) => lang.code === 'en'
    );
    expect(button).not.toHaveTextContent(currentLanguage?.name || 'English');
  });

  test('shows native names when showNativeNames prop is true', () => {
    render(<LanguageSelector showNativeNames />);

    // Click the button to open the menu
    fireEvent.click(screen.getByRole('button'));

    // Should show native names
    supportedLanguages.forEach((language) => {
      expect(screen.getByText(language.nativeName)).toBeInTheDocument();
    });
  });
});
