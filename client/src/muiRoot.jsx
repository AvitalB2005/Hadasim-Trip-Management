import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { appTheme } from './theme.js';

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin]
});

export function MuiAppRoot({ children }) {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
