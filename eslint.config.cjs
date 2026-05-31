// Minimal flat ESLint config file for ESLint v10 to pick up.
// This avoids the "couldn't find eslint.config" error and lets
// the linter run while we iteratively enable stricter rules/plugins.
module.exports = [
  // Global ignores
  { ignores: ['.next/', 'out/', 'build/', 'next-env.d.ts'] },

  // Primary config for source files
  // JS/JSX files (use default JS parser)
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    // Register plugins used by the codebase so rules referencing them resolve.
    plugins: {
      'react-hooks': require('eslint-plugin-react-hooks'),
      '@next/next': require('@next/eslint-plugin-next'),
      react: require('eslint-plugin-react'),
    },
    rules: {},
  },

  // TS/TSX files: use @typescript-eslint/parser so TypeScript syntax (types, enums, non-null !) parses correctly
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // Do not enable type-aware linting by default to avoid needing project references here.
        // If you want type-aware rules, set `project: './tsconfig.json'` and ensure tsconfig exists.
      },
    },
    plugins: {
      'react-hooks': require('eslint-plugin-react-hooks'),
      '@next/next': require('@next/eslint-plugin-next'),
      react: require('eslint-plugin-react'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {},
  },
]
