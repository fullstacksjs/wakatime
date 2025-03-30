import { isNull } from '@fullstacksjs/toolbox';

import type { Container } from '../../config/initContainer.js';
import type { Repo } from '../repos/Repo.js';
import type { WakatimeSDK } from './WakatimeSDK.js';

import { Leaderboard } from '../models/Leaderboard.js';
import { toReportModel } from '../repos/ReportModel.js';
import { toUserModel } from '../repos/UserModel.js';
import { createBrowser, getScreenshot, openPage } from './puppeteer.js';

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

  async getScreenshot(): Promise<Buffer> {
    const browser = await createBrowser();
    const page = await openPage(browser, this.config.webpageUrl);
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
