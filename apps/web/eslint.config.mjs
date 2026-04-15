// @ts-check
import baseConfig from '@estimator/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...baseConfig,
  {
    ignores: ['src/routeTree.gen.ts', 'docs/**'],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          ignore: ['routeTree\\.gen\\.ts$'],
        },
      ],
    },
  },
);
