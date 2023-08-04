import { isNull } from '@fullstacksjs/toolbox';

import type { Container } from '../../config/initContainer.js';
import { Leaderboard } from '../models/Leaderboard.js';
import type { Repo } from '../repos/Repo.js';
import { toReportModel } from '../repos/ReportModel.js';
import { toUserModel } from '../repos/UserModel.js';
import type { WakatimeSDK } from './WakatimeSDK.js';

export class LeaderboardService {
  private reportRepo: Repo;
  private wakatime: WakatimeSDK;

  constructor(opts: Container) {
    this.reportRepo = opts.repo;
    this.wakatime = opts.wakatime;
  }

  async syncWeek() {
    const reports = await this.wakatime.getReports();
    if (!reports) return;

    await this.reportRepo.saveUsers(reports.data.map(toUserModel));
    await this.reportRepo.saveWeek(toReportModel(reports));
  }

  async syncDay() {
    const reports = await this.wakatime.getReports();
    if (!reports) throw Error('Cannot fetch reports');

    await this.reportRepo.saveUsers(reports.data.map(toUserModel));
    await this.reportRepo.saveDay(toReportModel(reports));
  }

  async getWeek(size = 3): Promise<Leaderboard> {
    const report = await this.reportRepo.getTopWeekReports(size);

    if (isNull(report) || report.usages.some(u => isNull(u.user))) {
      await this.syncWeek();
      return this.getWeek(size);
    }

    return Leaderboard.fromReport(report);
  }

  async getDay(size = 3): Promise<Leaderboard> {
    const report = await this.reportRepo.getTopDayReport(size);
    console.log({ report });

    if (isNull(report) || report.usages.some(u => isNull(u.user))) {
      await this.syncDay();
      return this.getDay(size);
    }

    return Leaderboard.fromReport(report);
  }
}
