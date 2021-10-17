import { getRequiredEnv } from '@fullstacksjs/toolbox';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

interface Config {
  apiKey: string;
  puppeteerExecutablePath: string;
  leaderboardUrl: string;
  webpageUrl: string;
  dbFilePath: string;
}

const toAbsolutePath = (filename: string) =>
  join(dirname(fileURLToPath(import.meta.url)), filename);

export function getConfig(): Config {
  dotenv.config();
  return {
    apiKey: getRequiredEnv('API_KEY'),
    puppeteerExecutablePath: getRequiredEnv('PUPPETEER_EXECUTABLE_PATH'),
    leaderboardUrl: getRequiredEnv('LEADERBOARD_URL'),
    webpageUrl: getRequiredEnv('WEBPAGE_URL'),
    dbFilePath: toAbsolutePath('../data/db.json'),
  };
}
