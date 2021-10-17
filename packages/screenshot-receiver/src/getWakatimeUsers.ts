import axios from 'axios';

import { getConfig } from './getConfig.js';
import { ReportAndUser, toUser, WakatimeUser } from './model.js';

interface GetWakatimeUserResponse {
  data: WakatimeUser[];
}

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
