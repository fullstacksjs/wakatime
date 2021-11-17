import { getEnv, getRequiredEnv, toInteger } from '@fullstacksjs/toolbox';
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
    port: toInteger(getEnv('PORT') ?? '3000'),
    wakatimeDbFilePath: toAbsolutePath('../data/wakatime.db.json'),
    scheduleDbFilePath: toAbsolutePath('../data/wakatime.db.json'),
  };
}
