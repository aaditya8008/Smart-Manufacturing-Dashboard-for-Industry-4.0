// Import ESLint recommended JS rules
import js from '@eslint/js'
import globals from 'globals'

// React hooks linting rules
import reactHooks from 'eslint-plugin-react-hooks'

// React fast refresh support for Vite
import reactRefresh from 'eslint-plugin-react-refresh'

// ESLint config helpers
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build folder
  globalIgnores(['dist']),
  {
    // Apply rules to JS and JSX files
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true }, // Enable JSX
        sourceType: 'module',
      },
    },
    rules: {
      // Error for unused variables
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
