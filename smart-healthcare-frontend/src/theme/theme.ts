import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0A0E14', paper: '#141B25' },
    primary: { main: '#3987E5', light: '#5AA2F2' },
    secondary: { main: '#2DD4BF' },
    success: { main: '#34D399' },
    warning: { main: '#FBBF24' },
    error: { main: '#F87171' },
    text: { primary: '#EEF2F8', secondary: '#93A3B8' },
    divider: '#232F3E',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    h4: { fontWeight: 650, letterSpacing: '-0.02em' },
    h5: { fontWeight: 650, letterSpacing: '-0.015em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    button: { fontWeight: 550 },
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
        root: { textTransform: 'none', fontWeight: 550, borderRadius: 10 },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 6px 18px rgba(57, 135, 229, 0.28)' },
        },
      },
    },

    // Reused by 3+ unrelated components (Header's avatar trigger, LeftMenu's
    // toggle, Drawer's close button) — qualifies as shared, not single-use.
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          transition: 'color 0.15s ease, background-color 0.15s ease',
          '&:hover': { color: theme.palette.text.primary, backgroundColor: 'rgba(255, 255, 255, 0.06)' },
        }),
      },
    },

    // Every text field in every form gets the same resting and focused border.
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: '#0F141C',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.divider },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2F3D50' },
        }),
      },
    },

    // Table headers read as labels, not as data.
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          color: theme.palette.text.secondary,
          fontWeight: 600,
          fontSize: '0.8125rem',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          backgroundColor: '#0F141C',
        }),
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 550, borderRadius: 8 },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: '#1B2431', border: '1px solid #2F3D50', fontSize: '0.8rem' },
      },
    },
  },
});
