// @ts-check
import baseConfig from '@estimator/eslint-config';
import tseslint from 'typescript-eslint';

export default tseslint.config(...baseConfig, {
  languageOptions: {
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
