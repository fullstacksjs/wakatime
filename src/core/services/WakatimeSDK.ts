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
    try {
      return await this.httpClient.get(
        `?api_key=${encodeURIComponent(this.config.wakatime.apiKey)}`,
        { headers: { Accept: 'application/json' } },
      );
    } catch {
      return undefined;
    }
  }
}
