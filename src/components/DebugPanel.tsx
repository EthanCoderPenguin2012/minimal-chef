import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ExpandMore,
  BugReport,
  Clear,
  NetworkCheck,
  Close,
} from '@mui/icons-material';
import { useDebug } from '../contexts/DebugContext';
import { useAuth } from '../contexts/AuthContext';

const DebugPanel = () => {
  const { debugLogs, clearDebugLogs, addDebugLog } = useDebug();
  const { user } = useAuth();
  const [testUrl, setTestUrl] = useState('');
  const [showPanel, setShowPanel] = useState(true);

  const testRecipeImport = async () => {
    if (!testUrl) return;
    
    addDebugLog(`Testing recipe import: ${testUrl}`);
    try {
      const response = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl })
      });
      
      const data = await response.json();
      addDebugLog(`Import result: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addDebugLog(`Import error: ${error}`);
    }
  };

  const getLocalStorageData = (): Record<string, string | null> => {
    const data: Record<string, string | null> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('minimalChef')) {
        data[key] = localStorage.getItem(key);
      }
    }
    return data;
  };

  if (!showPanel) {
    return (
      <Box sx={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<BugReport />}
          onClick={() => setShowPanel(true)}
          size="small"
        >
          Debug
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'fixed', top: 10, right: 10, width: 400, zIndex: 9999 }}>
      <Alert severity="warning" sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2">Debug Mode Active</Typography>
          <IconButton size="small" onClick={() => setShowPanel(false)}>
            <Close />
          </IconButton>
        </Box>
      </Alert>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <BugReport sx={{ mr: 1 }} />
            Debug Panel
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>System Info</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="User Status" 
                    secondary={user ? `Logged in as ${user.username}` : 'Not logged in'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Environment" 
                    secondary={process.env.NODE_ENV} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="User Agent" 
                    secondary={navigator.userAgent.substring(0, 50) + '...'} 
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Local Storage</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                <pre style={{ fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(getLocalStorageData(), null, 2)}
                </pre>
              </Box>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Recipe Import Test</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter recipe URL to test"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={testRecipeImport}
                disabled={!testUrl}
                startIcon={<NetworkCheck />}
              >
                Test Import
              </Button>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Debug Logs ({debugLogs.length})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Recent Activity</Typography>
                <Button size="small" onClick={clearDebugLogs} startIcon={<Clear />}>
                  Clear
                </Button>
              </Box>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {debugLogs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No debug logs yet
                  </Typography>
                ) : (
                  debugLogs.slice(-10).map((log, index) => (
                    <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '11px', mb: 0.5 }}>
                      {log}
                    </Typography>
                  ))
                )}
              </Box>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Chip label="Dev Build" size="small" color="warning" />
            <Chip label="Debug Active" size="small" color="error" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DebugPanel;