// eslint.config.js
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default defineConfig([
  globalIgnores(['**/node_modules/**', '**/*.xml']),
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      import: importPlugin,
      prettier,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'] },
        typescript: {}
      }
    },
    rules: {
      'linebreak-style': ['warn', 'unix'],
      quotes: ['warn', 'single'],
      semi: ['warn', 'always'],
      'no-console': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/display-name': 'off',
      'react/jsx-key': 'error',
      'react/jsx-max-props-per-line': ['error', { maximum: 3 }],
      'react/jsx-newline': ['error', { prevent: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'simple-import-sort/exports': 'warn',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^react(.*)$', '^next', '^[a-z]', '^@?\\w'],
            ['^'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.(gif|png|svg|jpg)$'],
            ['^.+\\.s?css$'],
            ['^\\u0000']
          ]
        }
      ],
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }
      ],
      'no-duplicate-imports': 'off',
      'no-extra-boolean-cast': 'off',
      'plugin-checker/path-checker': 'off'
    }
  }
]);
