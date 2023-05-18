import axios from 'axios';

import { container } from '../../config/container.js';

export async function getLeaderboard(): Promise<WakatimeUserResponse> {
  const config = container.cradle.config;
  const { data } = await axios.get<WakatimeUserResponse>(config.leaderboardUrl, {
    params: { api_key: config.apiKey },
    timeout: 10000,
  });

  return data;
}
