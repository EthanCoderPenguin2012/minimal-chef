import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import A11yLanguageSelector from '../components/A11yLanguageSelector';
import TranslationDebugger from '../components/TranslationDebugger';
import { useA11yLanguage } from '../hooks/useA11yLanguage';

const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation('settings');

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title', 'Settings')}
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        {t(
          'devBuildNotice',
          'This is a developer build. Some features may be unstable.'
        )}
      </Alert>

      <Paper sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          {t('language.languageSettings', 'Language Settings')}
        </Typography>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('language.selectPreferred', 'Select your preferred language')}
          </Typography>

          {/* Standard language selector */}
          <Box sx={{ mb: 3 }}>
            <LanguageSelector variant="menu" showFlags showNativeNames />
          </Box>

          {/* Accessible language selector with screen reader support */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              {t('language.accessibleSelector', 'Accessible Language Selector')}
            </Typography>
            <A11yLanguageSelector
              helperText={t(
                'language.a11yHelperText',
                'This selector announces language changes to screen readers'
              )}
            />
          </Box>
        </Box>
      </Paper>

      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>
          {t('appSettings', 'Application Settings')}
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemText
              primary={t('darkMode', 'Dark Mode')}
              secondary={t(
                'darkModeDescription',
                'Switch between light and dark themes'
              )}
            />
            <ListItemSecondaryAction>
              <Switch checked={isDarkMode} onChange={toggleTheme} />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={t('voiceCommands', 'Voice Commands')}
              secondary={t(
                'voiceCommandsDescription',
                'Enable voice control for recipe instructions'
              )}
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={t('textToSpeech', 'Text-to-Speech')}
              secondary={t(
                'textToSpeechDescription',
                'Read recipe instructions aloud'
              )}
            />
            <ListItemSecondaryAction>
              <Switch defaultChecked />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary={t('instacartIntegration', 'Instacart Integration')}
              secondary={t(
                'instacartIntegrationDescription',
                'Connect with Instacart for grocery delivery'
              )}
            />
            <ListItemSecondaryAction>
              <Switch />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Translation debugger only appears in development mode */}
      {process.env.NODE_ENV === 'development' && <TranslationDebugger />}
    </Box>
  );
};

export default Settings;
