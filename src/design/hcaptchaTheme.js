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
      100: 'var(--color-surface)',
      200: 'var(--color-surface)',
      300: 'var(--color-border)',
      400: 'var(--color-border)',
      500: 'var(--color-text-muted)',
      600: 'var(--color-text-muted)',
      700: 'var(--color-text)',
      800: 'var(--color-footer)',
      900: 'var(--color-footer)',
      1000: 'var(--color-footer)'
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
      100: 'var(--color-footer)',
      200: 'var(--color-on-footer-dark)',
      300: 'var(--color-on-footer-subtle)',
      400: 'var(--color-text-muted)',
      500: 'var(--color-on-footer-muted)',
      600: 'var(--color-on-footer)',
      700: 'var(--color-text)',
      800: 'var(--color-surface)',
      900: 'var(--color-bg)',
      1000: 'var(--color-bg)'
    }
  }
};

export function getHCaptchaTheme(mode) {
  const scheme = mode || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  return scheme === 'dark' ? darkTheme : lightTheme;
}
