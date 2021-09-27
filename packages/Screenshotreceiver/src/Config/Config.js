const { config } = require('dotenv');
const { create } = require('axios');

const DotEnvErrorChecker = () => {
  const { error } = config();
  if (error) {
    console.error(error);
    throw Error('There was a problem reading the .env file.');
  }
};

DotEnvErrorChecker();

const {
  API_KEY,
  PUPPETEER_EXECUTABLE_PATH,
  API_URL,
  LEADERBOARD_ID,
  WEBPAGE_URL,
} = process.env;

const ValidateEnv = () => {
  if (!API_KEY) {
    throw Error('API_KEY is not defined in .env file');
  }
  if (!PUPPETEER_EXECUTABLE_PATH) {
    throw Error('PUPPETEER_EXECUTABLE_PATH is not defined in .env file');
  }
  if (!API_URL) {
    throw Error('API_URL is not defined in .env file');
  }
  if (!LEADERBOARD_ID) {
    throw Error('LEADERBOARD_ID is not defined in .env file');
  }
  if (!WEBPAGE_URL) {
    throw Error('WEBPAGE_URL is not defined in .env file');
  }
};

ValidateEnv();

const BaseUrlResolver = () =>
  API_URL.endsWith('/')
    ? `${API_URL}${LEADERBOARD_ID}`
    : `${API_URL}/${LEADERBOARD_ID}`;

const NewAxios = create({
  baseURL: BaseUrlResolver(),
  params: {
    // eslint-disable-next-line camelcase
    api_key: API_KEY,
  },
  timeout: 10000,
});

module.exports = {
  API_KEY,
  PUPPETEER_EXECUTABLE_PATH,
  axios: NewAxios,
  WEBPAGE_URL,
};
