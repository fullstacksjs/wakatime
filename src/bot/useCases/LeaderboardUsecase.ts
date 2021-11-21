import { getWeekOfYear } from 'src/utils/date';
import dedent from 'ts-dedent';
import { Inject, InjectValue } from 'typescript-ioc';

import type { LeaderboardModel } from '../../models/Leaderboard';
import type { LeaderboardRepo } from '../../repos/LeaderboardRepo';
import type { PuppeteerService } from '../../Services/PuppeteerService';

export class LeaderboardUseCase {
  @InjectValue('config') private config!: Config;
  @Inject() private wakatimeRepo!: LeaderboardRepo;
  @Inject() private puppetersService!: PuppeteerService;

  private getReportCaption(leaderboard: LeaderboardModel) {
    return leaderboard.getCaption();
  }

  async execute(): Promise<Leaderboard> {
    const topUsers = await this.wakatimeRepo.getTopUsers(3);

    const image = await this.puppetersService.getScreenshot({
      url: this.config.webpageUrl,
      puppeteerExecutablePath: this.config.puppeteerExecutablePath,
      encoding: 'binary',
      type: 'png',
      width: 815,
      height: 700,
      deviceScaleFactor: 2,
      timeout: 2000,
    });

    return { caption: this.getReportCaption(topUsers), image };
  }
}
