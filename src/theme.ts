import { createTheme, Theme, ThemeOptions } from '@mui/material/styles';
import { isRTL } from './utils/languageConfig';

// Base typography settings
const typography = {
  h1: { fontFamily: '"Times New Roman", serif' },
  h2: { fontFamily: '"Times New Roman", serif' },
  h3: { fontFamily: '"Times New Roman", serif' },
  h4: { fontFamily: '"Times New Roman", serif' },
  h5: { fontFamily: '"Times New Roman", serif' },
  h6: { fontFamily: '"Times New Roman", serif' },
  subtitle1: { fontFamily: '"Times New Roman", serif' },
  subtitle2: { fontFamily: '"Times New Roman", serif' },
  body1: { fontFamily: '"Noto Sans", sans-serif' },
  body2: { fontFamily: '"Noto Sans", sans-serif' },
  button: { fontFamily: '"Noto Sans", sans-serif' },
  caption: { fontFamily: '"Noto Sans", sans-serif' },
  overline: { fontFamily: '"Noto Sans", sans-serif' },
};

// Base light theme options
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#203141',
    },
    background: {
      default: '#EADDCB',
      paper: '#F5F0E8',
    },
    text: {
      primary: '#203141',
    },
  },
  typography,
};

// Base dark theme options
const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#EADDCB',
    },
    background: {
      default: '#203141',
      paper: '#2A3F52',
    },
    text: {
      primary: '#EADDCB',
    },
  },
  typography,
};

/**
 * Creates a theme with RTL support based on the current language
 * @param options Theme options
 * @param language Current language code
 * @returns Theme with RTL support if needed
 */
export const createRTLSupportedTheme = (
  options: ThemeOptions,
  language: string
): Theme => {
  return createTheme({
    ...options,
    direction: isRTL(language) ? 'rtl' : 'ltr',
    // Add additional RTL-specific overrides if needed
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: isRTL(language)
            ? {
                direction: 'rtl',
              }
            : {},
        },
      },
    },
  });
};

// Create initial themes (will be updated when language changes)
const lightTheme = createTheme(lightThemeOptions);
const darkTheme = createTheme(darkThemeOptions);

/**
 * Get theme with RTL support based on current language
 * @param isDarkMode Whether to use dark mode
 * @param language Current language code
 * @returns Theme with RTL support
 */
export const getThemeWithRTLSupport = (
  isDarkMode: boolean,
  language: string
): Theme => {
  return createRTLSupportedTheme(
    isDarkMode ? darkThemeOptions : lightThemeOptions,
    language
  );
};

export { lightTheme, darkTheme };
