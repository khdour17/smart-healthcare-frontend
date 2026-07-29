import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0A0A0F', paper: '#17171F' },
    primary: { main: '#3B82F6' },
    success: { main: '#22C55E' },
    error: { main: '#EF4444' },
    text: { primary: '#F5F5F7', secondary: '#9494A3' },
    divider: '#26262F',
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    // Only a prop default (color="inherit" instead of AppBar's built-in "primary") —
    // this can't be expressed as CSS at all, so it has no choice but to live here.
    MuiAppBar: {
      defaultProps: { color: 'inherit' },
    },

    // Generic reset applied to EVERY Paper anywhere (cards, drawers, tables) —
    // genuinely cross-cutting, not tied to any one file.
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    // Every button in the app, no exceptions — a true global behavior default.
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },

    // Reused by 3+ unrelated components (Header's avatar trigger, LeftMenu's
    // toggle, Drawer's close button) — qualifies as shared, not single-use.
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          transition: 'color 0.15s ease, background-color 0.15s ease',
          '&:hover': { color: theme.palette.text.primary },
        }),
      },
    },
  },
});