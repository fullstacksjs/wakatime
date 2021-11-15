module.exports = {
  extends: ['@fullstacksjs', '@fullstacksjs/eslint-config/esm.js'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
