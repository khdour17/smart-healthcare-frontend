import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/global.scss';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import {
  CssBaseline,
  ThemeProvider,
} from '@mui/material';

import { AuthContextProvider } from './contexts/AuthContextProvider';
import { AppRouter } from './routes/AppRouter';
import { theme } from './theme/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>,
);