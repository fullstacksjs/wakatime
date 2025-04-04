import axios from 'axios';

import type { Container } from '../../config/initContainer.ts';

import { createBrowser, getScreenshot, openPage } from './puppeteer.ts';

export class AdventService {
  config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
  }

  public async getLeaderboard(): Promise<AdventLeaderboard> {
    const { data: res } = await axios.get<AdventOfCodeResponse>(this.config.advent.webpageUrl);

    return res
      .sort((a, b) => b.local_score - a.local_score)
      .map<AdventUser>(row => {
        return {
          name: row.name!,
          score: row.local_score,
          stars: Object.values(row.completion_day_level).reduce<AdventUser['stars']>(
            (acc, star) => {
              if (star[0]) acc.silver++;
              if (star[1]) acc.gold++;
              return acc;
            },
            { gold: 0, silver: 0 },
          ),
        };
      });
  }

  public async getScreenshot(): Promise<Uint8Array> {
    const browser = await createBrowser();
    const page = await openPage(browser, this.config.advent.webpageUrl);
    const screenshot = await getScreenshot(page);
    await browser.close();

    return screenshot;
  }
}
