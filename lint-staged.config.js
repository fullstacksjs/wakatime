/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.ts': 'eslint --fix',
  '*.{md,json,css,html}': 'prettier --write',
};
