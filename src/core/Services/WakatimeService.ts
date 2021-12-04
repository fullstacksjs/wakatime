import axios from 'axios';

import { LeaderboardModel } from '../models/Leaderboard.js';

interface GetWakatimeUserResponse {
  data: WakatimeDto[];
}

export class WakatimeService {
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
  }

  async getLeaderboard(): Promise<LeaderboardModel> {
    const res = await axios.get<GetWakatimeUserResponse>(this.config.leaderboardUrl, {
      params: { api_key: this.config.apiKey },
      timeout: 10000,
    });

    return LeaderboardModel.fromDto(res.data.data);
  }
}
