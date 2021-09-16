module.exports = {
  "*.*": "prettier '**/*' --write --ignore-unknown",
  "*.js": "./node_modules/.bin/eslint --fix",
};
