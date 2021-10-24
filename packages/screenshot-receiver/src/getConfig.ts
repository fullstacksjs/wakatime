import { getRequiredEnv } from '@fullstacksjs/toolbox';
import dotenv from 'dotenv';

interface Config {
  puppeteerExecutablePath: string;
  webpageUrl: string;
}
export function getConfig(): Config {
  dotenv.config();
  return {
    puppeteerExecutablePath: getRequiredEnv('PUPPETEER_EXECUTABLE_PATH'),
    webpageUrl: getRequiredEnv('WEBPAGE_URL'),
  };
}
