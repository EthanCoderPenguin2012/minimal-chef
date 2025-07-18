import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  FormHelperText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../utils/languageConfig';
import { announceLanguageChange } from '../utils/a11yLanguageUtils';

interface A11yLanguageSelectorProps {
  label?: string;
  helperText?: string;
  showNativeNames?: boolean;
  showFlags?: boolean;
}

/**
 * Accessible language selector component
 * Announces language changes to screen readers
 */
const A11yLanguageSelector: React.FC<A11yLanguageSelectorProps> = ({
  label = 'Language',
  helperText,
  showNativeNames = true,
  showFlags = true,
}) => {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);

    // Announce language change to screen readers
    announceLanguageChange(newLanguage);
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="a11y-language-select-label">
          {t('settings:language', label)}
        </InputLabel>
        <Select
          labelId="a11y-language-select-label"
          id="a11y-language-select"
          value={selectedLanguage}
          label={t('settings:language', label)}
          onChange={handleLanguageChange}
          // Accessibility attributes
          aria-label={t(
            'settings:selectLanguage',
            'Select your preferred language'
          )}
          aria-describedby="a11y-language-helper-text"
        >
          {supportedLanguages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              {showFlags && language.flag && (
                <span
                  role="img"
                  aria-label={language.name}
                  style={{ marginRight: 8 }}
                >
                  {language.flag}
                </span>
              )}
              <Typography component="span" lang={language.code}>
                {showNativeNames ? language.nativeName : language.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <FormHelperText id="a11y-language-helper-text">
            {t('settings:languageHelperText', helperText)}
          </FormHelperText>
        )}
      </FormControl>
    </Box>
  );
};

export default A11yLanguageSelector;
