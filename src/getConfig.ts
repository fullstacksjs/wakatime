import { getRequiredEnv } from '@fullstacksjs/toolbox';
import dotenv from 'dotenv';

import { toAbsolutePath } from './utils/path.js';

export function getConfig(): Config {
  dotenv.config();
  return {
    botToken: getRequiredEnv('BOT_TOKEN'),
    apiKey: getRequiredEnv('API_KEY'),
    puppeteerExecutablePath: getRequiredEnv('PUPPETEER_EXECUTABLE_PATH'),
    leaderboardUrl: getRequiredEnv('LEADERBOARD_URL'),
    webpageUrl: getRequiredEnv('WEBPAGE_URL'),
    dbFilePath: toAbsolutePath('../data/db.json'),
  };
}
