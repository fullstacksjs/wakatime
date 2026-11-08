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
    // Without `page`, WakaTime returns the page that contains the token owner, not the top.
    return await this.httpClient.get('?page=1', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.config.wakatime.accessToken}`,
      },
    });
  }
}
