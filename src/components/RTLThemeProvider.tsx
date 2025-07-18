import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';
import { getThemeWithRTLSupport } from '../theme';

interface RTLThemeProviderProps {
  children: React.ReactNode;
  isDarkMode: boolean;
}

/**
 * Theme provider that handles RTL support based on the current language
 * Automatically updates the theme when the language changes
 */
const RTLThemeProvider: React.FC<RTLThemeProviderProps> = ({
  children,
  isDarkMode,
}) => {
  const { currentLanguage } = useLanguage();

  // Create theme with RTL support based on current language
  const theme = useMemo(() => {
    return getThemeWithRTLSupport(isDarkMode, currentLanguage);
  }, [isDarkMode, currentLanguage]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default RTLThemeProvider;
