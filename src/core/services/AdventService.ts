import type { Container } from '../../config/initContainer.js';
import { createBrowser, getScreenshot, openPage } from './puppeteer.js';

export class AdventService {
  config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
  }

  async getLeaderboard(): Promise<{
    leaderboard: AdventLeaderboard;
    screenshot: Buffer;
  }> {
    const browser = await createBrowser();
    const page = await openPage(browser, this.config.adventUrl);
    const screenshot = await getScreenshot(page);
    const rows = await page.$$('tr');

    const defaultUser: AdventUser = { name: '', stars: { gold: 0, silver: 0 }, score: 0 };
    const [, ...leaderboard] = await Promise.all(
      rows.map(async row => {
        const tds = await row.$$('td');
        const user: AdventUser = { ...defaultUser };
        const nameTd = await tds[1]?.$('span');
        user.name = (await nameTd?.evaluate(el => el.textContent)) ?? '';

        const goldStars = await tds[2]?.$$('.text-accent-0');
        const silverStars = await tds[2]?.$$('.text-fg-0');
        user.stars = {
          gold: goldStars?.length ?? 0,
          silver: silverStars?.length ?? 0,
        };

        user.score =
          (await tds[3]?.evaluate(el => Number.parseInt(el.textContent ?? '0', 10))) ?? 0;

        return user;
      }),
    );
    await browser.close();

    const res = { leaderboard, screenshot };
    return res;
  }
}
