const { config } = require('dotenv');

const DotEnvErrorChecker = () => {
  const { error } = config();
  if (error) {
    throw Error(`There was a problem reading the .env file.\n${error}`);
  }
};
const { API_KEY, PUPPETEER_EXECUTABLE_PATH } = process.env;

DotEnvErrorChecker();

module.exports = {
  API_KEY,
  PUPPETEER_EXECUTABLE_PATH,
};
