module.exports = {
  extends: ['@fullstacksjs', '@fullstacksjs/eslint-config/esm.js'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: 'tsconfig.base.json',
      },
    },
  },
};
