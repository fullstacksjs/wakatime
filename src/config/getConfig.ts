import { getEnv, getRequiredEnv, toInteger } from '@fullstacksjs/toolbox';

import { toAbsolutePath } from '../utils/path.js';

export function getConfig(): Config {
  return {
    reportId: getRequiredEnv('REPORT_ID'),
    botToken: getRequiredEnv('BOT_TOKEN'),
    apiKey: getRequiredEnv('API_KEY'),
    leaderboardUrl: getRequiredEnv('LEADERBOARD_URL'),
    webpageUrl: getRequiredEnv('WEBPAGE_URL'),
    botPort: toInteger(getEnv('BOT_PORT', '3000')),
    apiPort: toInteger(getEnv('API_PORT', '4000')),
    dbFilePath: toAbsolutePath('../data/db.json'),
    puppeteerExecPath: getEnv('PUPPETEER_EXECUTABLE_PATH'),
    admin: toInteger(getRequiredEnv('ADMIN')),
    apiEndpoint: getRequiredEnv('API_ENDPOINT'),
  };
}
