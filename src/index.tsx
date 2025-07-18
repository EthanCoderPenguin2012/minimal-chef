import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import i18n configuration
import './i18n';
// Import RTL support styles
import './styles/rtl.css';
import { CircularProgress, Box } from '@mui/material';

// Loading component for suspense fallback
const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
