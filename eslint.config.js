import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Accessibility - WCAG 2.2 AA enforcement (jsx-a11y recommended baseline)
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/no-access-key': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-distracting-elements': 'warn',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/tabindex-no-positive': 'warn',
      
      // Dark Mode Compatibility - Prevent hardcoded Tailwind gray classes
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/text-gray-[0-9]/]',
          message: 'Avoid hardcoded Tailwind gray text classes. Use CSS variables: var(--color-text) or var(--color-text-muted), or import { useThemeColors } from utils/theme',
        },
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/bg-gray-[0-9]/]',
          message: 'Avoid hardcoded Tailwind gray backgrounds. Use CSS variables: var(--color-bg), var(--color-surface), or import { useThemeColors } from utils/theme',
        },
        {
          selector: 'JSXAttribute[name.name="className"][value.value=/border-gray-[0-9]/]',
          message: 'Avoid hardcoded Tailwind gray borders. Use CSS variable: var(--color-border) or import { useThemeColors } from utils/theme',
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
])
