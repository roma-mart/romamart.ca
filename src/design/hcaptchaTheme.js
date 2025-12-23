// src/design/hcaptchaTheme.js
// Dynamically generates hCaptcha theme based on prefers-color-scheme

// NOTE: hCaptcha custom themes require Pro/Enterprise. On free tier, always pass string 'dark' or 'light'.
// To enable custom themes in the future, switch to passing getHCaptchaTheme(colorScheme) as the theme prop.

const lightTheme = {
  palette: {
    mode: 'light',
    primary: { main: 'var(--color-primary)' },
    text: {
      heading: 'var(--color-heading)',
      body: 'var(--color-text)'
    },
    grey: {
      100: '#F8F8F8',
      200: '#F2F2F2',
      300: '#E5E5E5',
      400: '#D9D9D9',
      500: '#B3B3B3',
      600: '#8C8C8C',
      700: '#5A5A5A',
      800: '#2A2A2A',
      900: '#151515',
      1000: '#151515'
    }
  }
};

const darkTheme = {
  palette: {
    mode: 'dark',
    primary: { main: 'var(--color-primary)' },
    text: {
      heading: 'var(--color-heading)',
      body: 'var(--color-text)'
    },
    grey: {
      100: '#151515',
      200: '#2A2A2A',
      300: '#5A5A5A',
      400: '#8C8C8C',
      500: '#B3B3B3',
      600: '#D9D9D9',
      700: '#E5E5E5',
      800: '#F2F2F2',
      900: '#F8F8F8',
      1000: '#FFFFFF'
    }
  }
};

export function getHCaptchaTheme(mode) {
  const scheme = mode || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  return scheme === 'dark' ? darkTheme : lightTheme;
}
