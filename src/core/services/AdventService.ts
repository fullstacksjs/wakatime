import axios from 'axios';
import type { Container } from '../../config/initContainer.js';
import { createBrowser, getScreenshot, openPage } from './puppeteer.js';

export class AdventService {
  config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
  }

  public async getScreenshot(): Promise<Buffer> {
    const browser = await createBrowser();
    const page = await openPage(browser, this.config.adventUrl);
    const screenshot = await getScreenshot(page);
    await browser.close();

    return screenshot;
  }

  public async getLeaderboard(): Promise<AdventLeaderboard> {
    const { data: res } = await axios.get<AdventOfCodeResponse>(this.config.adventApi);

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
}
