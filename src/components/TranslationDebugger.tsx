import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * A development tool for debugging translations
 * Only shown in development mode
 */
const TranslationDebugger: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentLanguage, languages } = useLanguage();
  const [translationKey, setTranslationKey] = useState('');
  const [translationResult, setTranslationResult] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleTranslationTest = () => {
    if (!translationKey) {
      setError('Please enter a translation key');
      setTranslationResult(null);
      return;
    }

    try {
      const result = t(translationKey);
      setTranslationResult(result);
      setError(result === translationKey ? 'Translation key not found' : null);
    } catch (err) {
      setError('Error fetching translation');
      setTranslationResult(null);
    }
  };

  return (
    <Paper sx={{ mt: 3, p: 0 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Translation Debugger</Typography>
          <Chip label="Dev Only" color="warning" size="small" sx={{ ml: 2 }} />
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This tool helps debug translation issues. It is only available in
            development mode.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Current Language</Typography>
            <Typography>{currentLanguage}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2">Available Languages</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {languages.map((lang) => (
                <Chip
                  key={lang.code}
                  label={`${lang.name} (${lang.code})`}
                  variant={
                    lang.code === currentLanguage ? 'filled' : 'outlined'
                  }
                  color={lang.code === currentLanguage ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Test Translation Key
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              label="Translation Key"
              value={translationKey}
              onChange={(e) => setTranslationKey(e.target.value)}
              placeholder="e.g. common:navigation.home"
              fullWidth
              size="small"
              helperText="Format: namespace:key.path"
            />
            <Button
              variant="contained"
              onClick={handleTranslationTest}
              sx={{ mt: 0.5 }}
            >
              Test
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {translationResult && !error && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Translation: <strong>{translationResult}</strong>
            </Alert>
          )}

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2">Loaded Namespaces</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {Object.keys(i18n.options.ns || {}).map((ns) => (
                <Chip key={ns} label={ns} size="small" />
              ))}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default TranslationDebugger;
