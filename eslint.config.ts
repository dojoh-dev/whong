import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    plugins: { js },
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: { globals: globals.node },
  },
]);
