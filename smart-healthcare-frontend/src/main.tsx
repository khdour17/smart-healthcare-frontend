import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/global.scss';

import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';

import { AuthContextProvider } from './contexts/AuthContextProvider';
import { ToastContextProvider } from './contexts/ToastContextProvider';
import { AppRouter } from './routes/AppRouter';
import { theme } from './theme/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContextProvider>
          <ToastContextProvider>
            <AppRouter />
          </ToastContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
);