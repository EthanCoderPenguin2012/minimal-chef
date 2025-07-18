import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Typography,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageOption } from '../utils/languageConfig';

interface LanguageSelectorProps {
  variant?: 'menu' | 'dropdown' | 'list';
  showFlags?: boolean;
  showNativeNames?: boolean;
  compact?: boolean;
  size?: 'small' | 'medium';
}

/**
 * Language selector component that allows users to change the application language
 *
 * @param variant - The visual variant of the selector (menu, dropdown, or list)
 * @param showFlags - Whether to show language flags
 * @param showNativeNames - Whether to show language names in their native form
 * @param compact - Whether to show a compact version (icon only)
 * @param size - Size of the component (small or medium)
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  showFlags = true,
  showNativeNames = false,
  compact = false,
  size = 'medium',
}) => {
  const {
    currentLanguage,
    changeLanguage,
    languages,
    getCurrentLanguageDetails,
    isLanguageLoading,
  } = useLanguage();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLang = getCurrentLanguageDetails();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (lang: string) => {
    handleClose();
    await changeLanguage(lang);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    changeLanguage(event.target.value);
  };

  // Helper function to render language display
  const renderLanguageDisplay = (language: LanguageOption) => {
    return (
      <>
        {showFlags && language.flag && (
          <Box
            component="span"
            sx={{ mr: 1, fontSize: size === 'small' ? '1rem' : '1.2rem' }}
          >
            {language.flag}
          </Box>
        )}
        {showNativeNames ? language.nativeName : language.name}
      </>
    );
  };

  // Menu variant
  if (variant === 'menu') {
    return (
      <Box>
        <Button
          onClick={handleClick}
          startIcon={compact ? undefined : <LanguageIcon />}
          endIcon={
            isLanguageLoading ? <CircularProgress size={16} /> : undefined
          }
          size={size}
          color="primary"
          aria-label="Select language"
        >
          {compact ? (
            <LanguageIcon />
          ) : currentLang ? (
            renderLanguageDisplay(currentLang)
          ) : (
            'English'
          )}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={language.code === currentLanguage}
            >
              {showFlags && language.flag && (
                <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                  <span>{language.flag}</span>
                </ListItemIcon>
              )}
              <ListItemText>
                {showNativeNames ? (
                  <Typography variant="body1">
                    {language.nativeName}
                    {language.nativeName !== language.name && (
                      <Typography
                        variant="caption"
                        sx={{ ml: 1, color: 'text.secondary' }}
                      >
                        ({language.name})
                      </Typography>
                    )}
                  </Typography>
                ) : (
                  language.name
                )}
              </ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <FormControl size={size} sx={{ minWidth: 120 }}>
        <InputLabel id="language-select-label">Language</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={currentLanguage}
          onChange={handleSelectChange}
          label="Language"
          disabled={isLanguageLoading}
          startAdornment={
            isLanguageLoading ? (
              <CircularProgress size={16} sx={{ mr: 1 }} />
            ) : undefined
          }
        >
          {languages.map((language) => (
            <MenuItem key={language.code} value={language.code}>
              {renderLanguageDisplay(language)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  // List variant
  if (variant === 'list') {
    return (
      <List>
        {languages.map((language) => (
          <ListItem key={language.code} disablePadding>
            <ListItemButton
              selected={language.code === currentLanguage}
              onClick={() => handleLanguageChange(language.code)}
              disabled={isLanguageLoading}
            >
              {showFlags && language.flag && (
                <ListItemIcon>
                  <span>{language.flag}</span>
                </ListItemIcon>
              )}
              <ListItemText
                primary={showNativeNames ? language.nativeName : language.name}
                secondary={
                  showNativeNames && language.nativeName !== language.name
                    ? language.name
                    : undefined
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    );
  }

  // Compact icon-only variant for header
  if (compact) {
    return (
      <Tooltip title={`Language: ${currentLang?.name || 'English'}`}>
        <IconButton
          onClick={handleClick}
          size={size}
          color="inherit"
          aria-label="Select language"
        >
          {isLanguageLoading ? (
            <CircularProgress
              size={size === 'small' ? 16 : 24}
              color="inherit"
            />
          ) : (
            <LanguageIcon />
          )}
        </IconButton>
      </Tooltip>
    );
  }

  // Default fallback
  return (
    <Button
      onClick={handleClick}
      startIcon={<LanguageIcon />}
      size={size}
      color="primary"
      aria-label="Select language"
    >
      {currentLang ? currentLang.name : 'English'}
    </Button>
  );
};

export default LanguageSelector;
