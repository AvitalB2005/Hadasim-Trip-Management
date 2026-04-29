import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  direction: 'rtl',
  palette: { mode: 'light' },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { direction: 'rtl' },
        body: { direction: 'rtl' }
      }
    }
  }
});
