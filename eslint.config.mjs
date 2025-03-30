import { defineConfig } from '@fullstacksjs/eslint-config';

export default defineConfig({
  node: true,
  rules: {
    '@typescript-eslint/switch-exhaustiveness-check': 'off',
    'no-empty-function': ['warn', { allow: ['constructors'] }],
  },
});
