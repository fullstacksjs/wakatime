import axios from 'axios';

import { getConfig } from './getConfig.js';

interface GetWakatimeUserResponse {
  data: WakatimeUser[];
}

const toUser = (wakatimeUser: WakatimeUser): ReportAndUser => ({
  report: {
    rank: wakatimeUser.rank,
    dailyAverage: wakatimeUser.running_total.daily_average,
    totalSeconds: wakatimeUser.running_total.total_seconds,
    userId: wakatimeUser.user.id,
  },
  user: {
    id: wakatimeUser.user.id,
    name: wakatimeUser.user.display_name,
    avatar: wakatimeUser.user.photo,
    username: wakatimeUser.user.username,
    lastTotalSeconds: wakatimeUser.running_total.total_seconds,
    lastDailyAverage: wakatimeUser.running_total.daily_average,
    lastRank: wakatimeUser.rank,
    diff: 0,
  },
});

const httpClient = axios.create({
  baseURL: getConfig().leaderboardUrl,
  params: { api_key: getConfig().apiKey },
  timeout: 10000,
});

export function getUsers(): Promise<ReportAndUser[]> {
  return httpClient
    .get<GetWakatimeUserResponse>('/')
    .then(res => res.data)
    .then(wakatimeUserResponse => wakatimeUserResponse.data.map(toUser));
}
