import type { Container } from '../../config/initContainer.ts';

import { HttpClient } from './HttpClient.ts';

export class WakatimeSDK {
  private config: Config;
  private httpClient: HttpClient;

  constructor(opts: Container) {
    this.config = opts.config;
    this.httpClient = new HttpClient(this.config.wakatime.leaderboardUrl);
  }

  async getReports(): Promise<WakatimeUserResponse | undefined> {
    return await this.httpClient.get(`?api_key=${this.config.wakatime.apiKey}`, {
      headers: {
        Accept: 'application/json',
      },
    });
  }
}
