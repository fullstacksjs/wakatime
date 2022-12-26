import { getEnv, getRequiredEnv, toInteger } from '@fullstacksjs/toolbox';
import dotenv from 'dotenv';

import { toAbsolutePath } from '../utils/path.js';

export function getConfig(): Config {
  dotenv.config();
  return {
    botToken: getRequiredEnv('BOT_TOKEN'),
    apiKey: getRequiredEnv('API_KEY'),
    leaderboardUrl: getRequiredEnv('LEADERBOARD_URL'),
    webpageUrl: getRequiredEnv('WEBPAGE_URL'),
    port: toInteger(getEnv('PORT', '3000')),
    dbFilePath: toAbsolutePath('../data/db.json'),
    puppeteerExecPath: getEnv('PUPPETEER_EXECUTABLE_PATH'),
    admin: toInteger(getRequiredEnv('ADMIN')),
  };
}
