import axios from 'axios';
import { InjectValue } from 'typescript-ioc';

import { LeaderboardModel } from '../models/Leaderboard';

interface GetWakatimeUserResponse {
  data: WakatimeDto[];
}

export class WakatimeService {
  @InjectValue('config') private config!: Config;

  async getLeaderboard(): Promise<LeaderboardModel> {
    const res = await axios.get<GetWakatimeUserResponse>(this.config.leaderboardUrl, {
      params: { api_key: this.config.apiKey },
      timeout: 10000,
    });

    return LeaderboardModel.fromDto(res.data.data);
  }
}
