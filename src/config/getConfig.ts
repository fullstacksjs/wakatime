import { getEnv, getRequiredEnv, toInteger } from '@fullstacksjs/toolbox';

import { toAbsolutePath } from '../utils/path.ts';

export function getConfig(): Config {
  return {
    reportId: getRequiredEnv('REPORT_ID'),
    botToken: getRequiredEnv('BOT_TOKEN'),
    apiKey: getRequiredEnv('API_KEY'),
    leaderboardUrl: getRequiredEnv('LEADERBOARD_URL'),
    webpageUrl: getRequiredEnv('WAKATIME_PAGE_URL'),
    adventUrl: getRequiredEnv('ADVENT_PAGE_URL'),
    botPort: toInteger(getEnv('BOT_PORT', '3000')),
    apiPort: toInteger(getEnv('API_PORT', '4000')),
    dbFilePath: toAbsolutePath('../data/db.json'),
    puppeteerExecPath: getEnv('PUPPETEER_EXECUTABLE_PATH'),
    admin: toInteger(getRequiredEnv('ADMIN')),
    apiEndpoint: getRequiredEnv('API_ENDPOINT'),
    adventApi: getRequiredEnv('ADVENT_API'),
  };
}
