import js from '@eslint/js';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jestPlugin from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // 通用配置，适用于所有文件
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescriptPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
      // 自定义规则
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      // 其他规则...
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // 针对测试文件的配置
  {
    files: ['tests/**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest, // 添加 Jest 全局变量
      },
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules, // 使用 Jest 推荐规则
    },
  },
  // 禁用与 Prettier 冲突的规则
  prettierConfig,
];