import { getRequiredEnv } from '@fullstacksjs/toolbox';
import dotenv from 'dotenv';

dotenv.config();

export interface Config {
  botToken: string;
}

export function getConfig(): Config {
  return {
    botToken: getRequiredEnv('BOT_TOKEN'),
  };
}
