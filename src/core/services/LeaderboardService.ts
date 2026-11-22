import { isNull } from '@fullstacksjs/toolbox';

import type { Container } from '../../config/initContainer.ts';
import type { Repo } from '../repos/Repo.ts';
import type { WakatimeSDK } from './WakatimeSDK.ts';

import { Leaderboard } from '../models/Leaderboard.ts';
import { toReportModel } from '../repos/ReportModel.ts';
import { toUserModel } from '../repos/UserModel.ts';
import { createBrowser, getScreenshot, openPage } from './puppeteer.ts';

interface ScreenshotBrowser {
  close: () => Promise<unknown>;
}

interface BrowserOps {
  createBrowser: () => Promise<ScreenshotBrowser>;
  openPage: (browser: ScreenshotBrowser, url: string) => Promise<unknown>;
  getScreenshot: (page: unknown) => Promise<Uint8Array>;
}

const defaultBrowserOps: BrowserOps = {
  createBrowser,
  openPage: (browser, url) => openPage(browser as Awaited<ReturnType<typeof createBrowser>>, url),
  getScreenshot: page => getScreenshot(page as Parameters<typeof getScreenshot>[0]),
};

export async function captureScreenshot(
  webpageUrl: string,
  ops: BrowserOps = defaultBrowserOps,
): Promise<Uint8Array> {
  const browser = await ops.createBrowser();

  try {
    const page = await ops.openPage(browser, webpageUrl);
    return await ops.getScreenshot(page);
  } finally {
    await browser.close();
  }
}

export class LeaderboardService {
  private config: Config;
  private reportRepo: Repo;
  private wakatime: WakatimeSDK;

  constructor(opts: Container) {
    this.reportRepo = opts.repo;
    this.wakatime = opts.wakatime;
    this.config = opts.config;
  }

  async backfillLanguages(): Promise<void> {
    if (!(await this.reportRepo.hasUsersMissingLanguageData())) return;

    await this.syncDay();
    await this.reportRepo.initializeMissingLanguages();
  }

  async getDay(size = 3): Promise<Leaderboard> {
    await this.backfillLanguages();
    let report = await this.reportRepo.getTopDayReport(size);

    if (isNull(report) || report.usages.length < size || report.usages.some(u => isNull(u.user))) {
      await this.syncDay();
      report = await this.reportRepo.getTopDayReport(size);
    }

    if (isNull(report)) throw Error('Cannot load day report');
    return Leaderboard.fromReport(report);
  }

  async getScreenshot(): Promise<Uint8Array> {
    return captureScreenshot(this.config.wakatime.webpageUrl);
  }

  async getWeek(size = 3): Promise<Leaderboard> {
    await this.backfillLanguages();
    let report = await this.reportRepo.getTopWeekReports(size);

    if (isNull(report) || report.usages.length < size || report.usages.some(u => isNull(u.user))) {
      await this.syncWeek();
      report = await this.reportRepo.getTopWeekReports(size);
    }

    if (isNull(report)) throw Error('Cannot load week report');
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
