import type { Axios } from 'axios';
import axios from 'axios';

import type { Container } from '../../config/initContainer.js';

export class WakatimeSDK {
  private config: Config;
  private client: Axios;

  constructor(opts: Container) {
    this.config = opts.config;
    this.client = axios.create({
      baseURL: this.config.leaderboardUrl,
      timeout: 10000,
      params: { api_key: this.config.apiKey },
    });
  }

  async getReports(): Promise<WakatimeUserResponse | undefined> {
    try {
      const { data } = await this.client.get<WakatimeUserResponse>('/');

      return data;
    } catch (e) {
      return undefined;
    }
  }
}
