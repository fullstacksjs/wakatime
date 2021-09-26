const { config } = require('dotenv');

const DotEnvErrorChecker = () => {
  const { error } = config();
  if (error) {
    throw Error(`There was a problem reading the .env file.\n${error}`);
  }
};
const { API_KEY, PUPPETEER_EXECUTABLE_PATH } = process.env;

const ValidateEnv = () => {
  if (!API_KEY) {
    throw Error('API_KEY is not defined in .env file');
  }
  if (!PUPPETEER_EXECUTABLE_PATH) {
    throw Error('PUPPETEER_EXECUTABLE_PATH is not defined in .env file');
  }
};

DotEnvErrorChecker();
ValidateEnv();

module.exports = {
  API_KEY,
  PUPPETEER_EXECUTABLE_PATH,
};
