// Brand and design tokens for Roma Mart
//
// SSOT ARCHITECTURE:
// - CSS Variables (src/index.css) are PRIMARY for theme-aware colors
// - They automatically respond to @media (prefers-color-scheme: dark)
// - JavaScript tokens.js exports semantic meaning and fallback values
//
// When using colors in React:
// - Use CSS variables directly: style={{ color: 'var(--color-primary)' }}
// - Or import semantic tokens for logic: import { semanticColors } from tokens.js
// - Avoid hardcoding colors - all colors must be theme-aware
//
// Central source of truth for design semantics, spacing, typography and logo sizing.
// Do NOT import colors from arbitrary constants elsewhere; use these tokens.

// Light mode reference values (CSS vars override these in dark mode)
export const brandColors = {
  navy: '#020178', // Primary brand navy (light mode base)
  yellow: '#E4B340', // Tulip Tree (consistent across modes)
  darkGrey: '#242424', // Baltic Sea
  black: '#151515', // Woodsmoke
  white: '#FFFFFF',
};

// Extended tonal scales (light -> dark or functional) for future theming / states
export const colorScales = {
  navy: ['#F2F4FF', '#D9DEFF', '#B4BBFF', '#8A95FF', '#5E6FFF', '#2E38D6', '#0C1194', '#020178', '#010045'],
  yellow: ['#FCF4E2', '#F8E3A8', '#F2CB6A', '#EAB640', '#E4B340', '#D89A1D', '#B57A00', '#8A5C00', '#5A3D00'],
  grey: ['#F8F8F8', '#F2F2F2', '#E5E5E5', '#D9D9D9', '#B3B3B3', '#8C8C8C', '#5A5A5A', '#2A2A2A', '#151515'],
};

// Functional (semantic) colors - light mode values for reference
// In React: Use CSS variables instead for theme support: 'var(--color-error)', 'var(--color-success)', etc.
// See src/index.css for CSS variable definitions (light + dark mode)
export const semanticColors = {
  error: { base: '#DC2626', surface: '#FEE2E2', textStrong: '#991B1B' },
  warning: { base: '#F59E0B', surface: '#FFFBEB', textStrong: '#78350F' },
  success: { base: '#059669', surface: '#ECFDF5', textStrong: '#064E3B' },
};

// Spacing scale (4pt baseline)
export const spacing = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];

// Border-radius scale (mirrors CSS variables --radius-* in index.css)
export const borderRadius = {
  sm: 'var(--radius-sm)', // 4px  — badges, chips
  md: 'var(--radius-md)', // 6px  — inputs, small cards
  lg: 'var(--radius-lg)', // 8px  — cards, panels, dropdowns
  xl: 'var(--radius-xl)', // 12px — featured cards, modals
  '2xl': 'var(--radius-2xl)', // 16px — large cards, sections
  '3xl': 'var(--radius-3xl)', // 24px — hero panels, CTA blocks
  full: 'var(--radius-full)', // pill buttons, avatars, badges
};

// Font families
export const fonts = {
  body: 'var(--font-body)', // Inter, defined in CSS.
  heading: 'var(--font-heading)', // Outfit, defined in CSS.
  logo: 'var(--font-heading)', // Outfit, defined in CSS.
};

// Logo recommended rendered pixel sizes from brand sheet
export const logoSizes = [180, 130, 64, 32, 16];

// Logo color schemes mapping (background, cart stroke, fill, text color)
// Used by <Logo /> component
export const logoSchemes = {
  navy: { bg: brandColors.navy, cart: brandColors.yellow, text: brandColors.white, invertCircle: true },
  brown: { bg: '#321B11', cart: brandColors.yellow, text: brandColors.white, invertCircle: true },
  cream: { bg: '#F7EFD2', cart: brandColors.yellow, text: brandColors.navy, invertCircle: false },
  yellow: { bg: brandColors.yellow, cart: brandColors.white, text: brandColors.white, invertCircle: true },
  lavender: { bg: '#B8C1FF', cart: brandColors.navy, text: brandColors.navy, invertCircle: true },
  lightGrey: { bg: '#E2E5E6', cart: brandColors.darkGrey, text: brandColors.darkGrey, invertCircle: true },
  white: {
    bg: brandColors.white,
    cart: brandColors.yellow,
    text: brandColors.navy,
    invertCircle: false,
    border: '#D1D6D8',
  },
  offWhite: { bg: '#ECEAE4', cart: '#8C8C8C', text: '#8C8C8C', invertCircle: true },
  dark: { bg: brandColors.black, cart: brandColors.white, text: brandColors.white, invertCircle: true },
};

// Elevation / shadow tokens (kept subtle for accessibility / contrast)
export const shadows = {
  sm: '0 1px 2px rgba(0,0,0,0.08)',
  md: '0 2px 4px rgba(0,0,0,0.12)',
  lg: '0 4px 16px rgba(0,0,0,0.18)',
};

// Motion durations & easing (respecting reduced motion)
export const motion = {
  fast: '120ms',
  base: '240ms',
  slow: '400ms',
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

// Internal compliance status colors (namespaced --internal-*)
// Used by compliance system pages under /internal/*
export const internalStatus = {
  good: { light: '#059669', dark: '#34D399', textLight: '#ECFDF5', textDark: '#064E3B' },
  warning: { light: '#D97706', dark: '#FBBF24', textLight: '#451A03', textDark: '#FFFBEB' },
  critical: { light: '#DC2626', dark: '#F87171', textLight: '#FEF2F2', textDark: '#450A0A' },
  neutral: { light: '#6B7280', dark: '#9CA3AF', textLight: '#F9FAFB', textDark: '#111827' },
};

// Smart semantic roles honoring brand + accessibility
export const roles = {
  // Status indicators
  open: { light: '#059669', dark: '#34D399', textLight: '#064E3B', textDark: '#ECFDF5' },
  closed: { light: '#991B1B', dark: '#FCA5A5', textLight: '#FEE2E2', textDark: '#450A0A' },
  // Availability (4-state)
  available: { light: '#065F46', dark: '#34D399', textLight: '#ECFDF5', textDark: '#D1FAE5' },
  limited: { light: '#F59E0B', dark: '#FCD34D', textLight: '#451A03', textDark: '#FFFBEB' },
  preorder: { light: '#2563EB', dark: '#93C5FD', textLight: '#1E3A8A', textDark: '#E0F2FE' },
  unavailable: { light: '#6B7280', dark: '#9CA3AF', textLight: '#111827', textDark: '#F9FAFB' },
  // Badges
  bestSeller: { light: '#020178', dark: '#E4B340', textLight: '#FFFFFF', textDark: '#151515' },
  halal: { light: '#0F766E', dark: '#34D399', textLight: '#ECFDF5', textDark: '#064E3B' },
  ageRestricted: { light: '#7F1D1D', dark: '#FCA5A5', textLight: '#FEE2E2', textDark: '#450A0A' },
  seasonal: { light: '#9333EA', dark: '#C4B5FD', textLight: '#F5F3FF', textDark: '#2E1065' },
};

export function getRoleColors(name, mode = 'light') {
  const role = roles[name];
  if (!role) return { bg: brandColors.navy, text: brandColors.white };
  const bg = role[mode];
  const text = mode === 'light' ? role.textLight : role.textDark;
  return { bg, text };
}

// Typography tokens
export const TYPOGRAPHY = {
  fontFamily: {
    heading: fonts.heading, // Outfit for headings.
    body: fonts.body, // Inter for body text.
  },
  fontWeight: {
    light: 300, // Inter for subtle text.
    normal: 400, // Inter for standard body text.
    medium: 500, // Inter for strong body emphasis.
    semibold: 600, // Outfit for H2 headings.
    bold: 700, // Inter for key UI elements.
    extraBold: 800, // Outfit for H1/display text.
  },
  fontSizes: {
    xs: '0.75rem', // Footnotes, captions.
    sm: '0.875rem', // Standard UI labels.
    base: '1rem', // Default body text.
    lg: '1.125rem', // Sub-headings, block quotes.
    xl: '1.375rem', // H3 Headings.
    '2xl': '1.75rem', // H2 Headings (Weight: 600 Semibold).
    '3xl': '2.25rem', // H1 Headings (Weight: 800 Extra Bold).
  },
  lineHeights: {
    xs: 1.45, // For extra small text.
    sm: 1.45, // For small text.
    base: 1.45, // For base text.
    lg: 1.4, // For large text.
    xl: 1.35, // For extra large text.
    '2xl': 1.25, // For 2XL headings.
    '3xl': 1.2, // For 3XL headings.
  },
};

export const tokens = {
  brandColors,
  colorScales,
  semanticColors,
  internalStatus,
  spacing,
  borderRadius,
  fonts,
  logoSizes,
  logoSchemes,
  shadows,
  motion,
  roles,
  getRoleColors,
  TYPOGRAPHY,
};

export default tokens;
