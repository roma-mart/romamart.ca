import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        process: 'readonly',
      },
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off', // Scripts are CLI tools, console is expected
      'no-undef': 'error',
    },
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.serviceworker,
        self: 'readonly',
        caches: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Service Worker needs logging for debugging
      'no-undef': 'error',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['scripts/**', 'public/sw.js'],
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
      'no-unused-vars': ['error', { 
        varsIgnorePattern: '^(_|[A-Z]|motion$)', // Ignore: underscore prefixed, uppercase (React components), and motion (used in JSX)
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
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
      // Note: text-gray-900 on bg-yellow is allowed (WCAG AAA contrast 8.4:1)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="className"] > Literal[value=/text-gray-[0-8]/]',
          message: 'Avoid hardcoded Tailwind gray text classes (text-gray-100 through text-gray-800). Use CSS variables: var(--color-text) or var(--color-text-muted). Note: text-gray-900 on bg-yellow is allowed for high contrast.',
        },
        {
          selector: 'JSXAttribute[name.name="className"] > Literal[value=/bg-gray-[0-9]/]',
          message: 'Avoid hardcoded Tailwind gray backgrounds. Use CSS variables: var(--color-bg), var(--color-surface), or import { useThemeColors } from utils/theme.',
        },
        {
          selector: 'JSXAttribute[name.name="className"] > Literal[value=/border-gray-[0-9]/]',
          message: 'Avoid hardcoded Tailwind gray borders. Use CSS variable: var(--color-border) or import { useThemeColors } from utils/theme.',
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'eqeqeq': ['error', 'always'],
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
])
