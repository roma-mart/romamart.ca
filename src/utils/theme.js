/**
 * Theme Utilities - Centralized Dark Mode Support
 * 
 * This module provides consistent theming utilities across the entire application.
 * All components should use these utilities instead of hardcoded colors.
 * 
 * @module utils/theme
 * @since December 1, 2025
 */

/**
 * CSS Variable Reference
 * 
 * These variables automatically adapt to light/dark mode via prefers-color-scheme.
 * Defined in src/index.css
 * 
 * @constant {Object} CSS_VARS
 */
export const CSS_VARS = {
  // Backgrounds
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  border: 'var(--color-border)',
  
  // Text
  text: 'var(--color-text)',
  textMuted: 'var(--color-text-muted)',
  
  // Brand
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
  heading: 'var(--color-heading)',
  icon: 'var(--color-icon)',
};

// Brand colors (dynamic via CSS variables)
export const BRAND_COLORS = {
  navy: 'var(--color-primary)',
  yellow: 'var(--color-accent)',
  black: 'var(--color-text)',
  white: 'var(--color-bg)',
};

/**
 * React Hook: Get theme-aware color objects
 * 
 * @returns {Object} Pre-configured style objects for common use cases
 * 
 * @example
 * ```jsx
 * import { useThemeColors } from '../utils/theme';
 * 
 * const MyComponent = () => {
 *   const colors = useThemeColors();
 *   
 *   return (
 *     <div style={colors.bg}>
 *       <h1 style={colors.heading}>Title</h1>
 *       <p style={colors.text}>Body text</p>
 *       <p style={colors.textMuted}>Secondary text</p>
 *     </div>
 *   );
 * };
 * ```
 */
export const useThemeColors = () => ({
  // Background styles
  bg: { backgroundColor: CSS_VARS.bg },
  surface: { backgroundColor: CSS_VARS.surface },
  
  // Text styles
  text: { color: CSS_VARS.text },
  textMuted: { color: CSS_VARS.textMuted },
  heading: { color: CSS_VARS.heading },
  
  // Combined styles (common patterns)
  mutedText: { color: CSS_VARS.text, opacity: 0.7 },
  
  // Border styles
  border: { borderColor: CSS_VARS.border },
  
  // Icon styles
  icon: { color: CSS_VARS.icon },
});

/**
 * Get inline style object for text color
 * 
 * @param {'text' | 'muted' | 'heading'} variant - Text variant
 * @returns {Object} Style object with color property
 * 
 * @example
 * ```jsx
 * <p style={getTextStyle('muted')}>Secondary text</p>
 * ```
 */
export const getTextStyle = (variant = 'text') => {
  const styles = {
    text: { color: CSS_VARS.text },
    muted: { color: CSS_VARS.textMuted },
    heading: { color: CSS_VARS.heading },
  };
  return styles[variant] || styles.text;
};

/**
 * Get inline style object for background color
 * 
 * @param {'bg' | 'surface'} variant - Background variant
 * @returns {Object} Style object with backgroundColor property
 * 
 * @example
 * ```jsx
 * <div style={getBackgroundStyle('surface')}>Card content</div>
 * ```
 */
export const getBackgroundStyle = (variant = 'bg') => {
  const styles = {
    bg: { backgroundColor: CSS_VARS.bg },
    surface: { backgroundColor: CSS_VARS.surface },
  };
  return styles[variant] || styles.bg;
};

/**
 * Combine multiple style objects
 * Useful when mixing theme styles with custom styles
 * 
 * @param {...Object} styles - Style objects to merge
 * @returns {Object} Combined style object
 * 
 * @example
 * ```jsx
 * <div style={combineStyles(
 *   getBackgroundStyle('surface'),
 *   getTextStyle('text'),
 *   { padding: '20px' }
 * )}>
 *   Content
 * </div>
 * ```
 */
export const combineStyles = (...styles) => Object.assign({}, ...styles);

/**
 * Special colors for always-dark backgrounds (Footer, RoCafé section)
 * These don't use CSS variables because the background is always dark
 */
export const DARK_BG_COLORS = {
  text: 'rgba(255, 255, 255, 0.9)',
  textMuted: 'rgba(255, 255, 255, 0.8)',
  textSubdued: 'rgba(255, 255, 255, 0.6)',
};

/**
 * Get text color for dark backgrounds
 * 
 * @param {'text' | 'muted' | 'subdued'} variant - Text variant
 * @returns {Object} Style object with color property
 * 
 * @example
 * ```jsx
 * // In Footer component (always dark background)
 * <p style={getDarkBgTextStyle('muted')}>Footer text</p>
 * ```
 */
export const getDarkBgTextStyle = (variant = 'text') => ({ color: DARK_BG_COLORS[variant] || DARK_BG_COLORS.text });

/**
 * WCAG 2.2 AA Contrast Ratios (for reference)
 * All combinations meet or exceed minimum requirements
 *
 * Light Mode:
 * - Navy (use `var(--color-primary)`) on White: 12.6:1 (AAA ✓)
 * - Text (use `var(--color-text)`) on White: 16:1 (AAA ✓)
 * - Muted (use `var(--color-text-muted)`) on White: 7.3:1 (AAA ✓)
 *
 * Dark Mode:
 * - Accent (use `var(--color-accent)`) on Black: 8.4:1 (AAA ✓)
 * - White (use `var(--color-bg)` or `#fff` token) on Black: 19.2:1 (AAA ✓)
 * - Muted (use `var(--color-text-muted)`) on Black: 9.1:1 (AAA ✓)
 */

/**
 * Migration Guide for Existing Components
 * 
 * ❌ BEFORE (Hardcoded Tailwind):
 * ```jsx
 * <p className="text-gray-600">Secondary text</p>
 * <div className="bg-gray-200">Card</div>
 * <div className="border-gray-300">Bordered</div>
 * ```
 * 
 * ✅ AFTER (CSS Variables):
 * ```jsx
 * import { useThemeColors } from '../utils/theme';
 * 
 * const Component = () => {
 *   const colors = useThemeColors();
 *   
 *   return (
 *     <>
 *       <p style={colors.textMuted}>Secondary text</p>
 *       <div style={colors.surface}>Card</div>
 *       <div className="border-2" style={colors.border}>Bordered</div>
 *     </>
 *   );
 * };
 * ```
 * 
 * 🔄 ALTERNATIVE (Direct CSS Variables):
 * ```jsx
 * <p style={{ color: 'var(--color-text-muted)' }}>Secondary text</p>
 * <div style={{ backgroundColor: 'var(--color-surface)' }}>Card</div>
 * <div style={{ borderColor: 'var(--color-border)' }}>Bordered</div>
 * ```
 */

export default {
  CSS_VARS,
  BRAND_COLORS,
  DARK_BG_COLORS,
  useThemeColors,
  getTextStyle,
  getBackgroundStyle,
  getDarkBgTextStyle,
  combineStyles,
};
