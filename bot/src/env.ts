import { getRequiredEnv } from '@fullstacksjs/toolbox';
import dotenv from 'dotenv';

dotenv.config();

export const TOKEN = getRequiredEnv('BOT_TOKEN');
export const leaderboardsId = getRequiredEnv('leaderboardsId');
export const WakaTimeAPIKey = getRequiredEnv('WAKATIME_API_KEY');
