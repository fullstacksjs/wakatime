import type { Axios } from 'axios';

import axios from 'axios';

import type { Container } from '../../config/initContainer.ts';

export class WakatimeSDK {
  private client: Axios;
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
    this.client = axios.create({
      timeout: 10000,
      params: { api_key: this.config.wakatime.apiKey },
    });
  }

  async getReports(): Promise<WakatimeUserResponse | undefined> {
    try {
      const { data } = await this.client.get<WakatimeUserResponse>(
        this.config.wakatime.leaderboardUrl,
      );

      return data;
    } catch {
      return undefined;
    }
  }
}
