import '@mui/material/styles';

import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: {
      background: string;
    };
  }
  interface PaletteOptions {
    sidebar?: {
      background: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#09090B',
      paper: '#18181B',
    },
    primary: {
      main: '#2563EB',
    },
    success: {
      main: '#22C55E',
    },
    error: {
      main: '#EF4444',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#A1A1AA',
    },
    divider: '#27272A',
    sidebar: {
      background: '#111113',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'sans-serif',
    ].join(','),
  },
});