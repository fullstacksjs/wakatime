import axios, { Axios } from 'axios';

import type { Container } from '../../config/initContainer.js';

export class WakatimeSDK {
  private config: Config;

  constructor(
    opts: Container,
    private client: Axios,
  ) {
    this.config = opts.config;
    this.client = new Axios({});
  }

  async getReports(): Promise<WakatimeUserResponse | undefined> {
    try {
      const { data } = await axios.get<WakatimeUserResponse>(this.config.leaderboardUrl, {
        params: { api_key: this.config.apiKey },
        timeout: 10000,
      });

      return data;
    } catch (e) {
      return undefined;
    }
  }
}
