import { isNull } from '@fullstacksjs/toolbox';

import type { Container } from '../../config/initContainer.ts';
import type { Repo } from '../repos/Repo.ts';
import type { WakatimeSDK } from './WakatimeSDK.ts';

import { Leaderboard } from '../models/Leaderboard.ts';
import { toReportModel } from '../repos/ReportModel.ts';
import { toUserModel } from '../repos/UserModel.ts';
import { createBrowser, getScreenshot, openPage } from './puppeteer.ts';

export class LeaderboardService {
  private config: Config;
  private reportRepo: Repo;
  private wakatime: WakatimeSDK;

  constructor(opts: Container) {
    this.reportRepo = opts.repo;
    this.wakatime = opts.wakatime;
    this.config = opts.config;
  }

  async getDay(size = 3): Promise<Leaderboard> {
    const report = await this.reportRepo.getTopDayReport(size);

    if (isNull(report) || report.usages.some(u => isNull(u.user))) {
      await this.syncDay();
      return this.getDay(size);
    }

    return Leaderboard.fromReport(report);
  }

  async getScreenshot(): Promise<Uint8Array> {
    const browser = await createBrowser();
    const page = await openPage(browser, this.config.wakatime.webpageUrl);
    const screenshot = await getScreenshot(page);
    await browser.close();

    return screenshot;
  }

  async getWeek(size = 3): Promise<Leaderboard> {
    const report = await this.reportRepo.getTopWeekReports(size);

    if (isNull(report) || report.usages.some(u => isNull(u.user))) {
      await this.syncWeek();
      return this.getWeek(size);
    }

    return Leaderboard.fromReport(report);
  }

  async syncDay() {
    const reports = await this.wakatime.getReports();
    if (!reports) throw Error('Cannot fetch reports');

    await this.reportRepo.saveUsers(reports.data.map(toUserModel));
    await this.reportRepo.saveDay(toReportModel(reports));
  }

  async syncWeek() {
    const reports = await this.wakatime.getReports();
    if (!reports) return;

    await this.reportRepo.saveUsers(reports.data.map(toUserModel));
    await this.reportRepo.saveWeek(toReportModel(reports));
  }
}
