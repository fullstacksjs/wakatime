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
    leaderboardDbFilePath: toAbsolutePath('../data/leaderboard.db.json'),
    scheduleDbFilePath: toAbsolutePath('../data/schedule.db.json'),
    userDbFilePath: toAbsolutePath('../data/user.db.json'),
  };
}
