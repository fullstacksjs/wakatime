import { isNull } from '@fullstacksjs/toolbox';

import type { Container } from '../../config/initContainer.js';
import { Leaderboard } from '../models/Leaderboard.js';
import type { Repo } from '../repos/Repo.js';
import { toReportModel } from '../repos/ReportModel.js';
import { toUserModel } from '../repos/UserModel.js';
import { getLeaderboard } from './getLeaderboard.js';

export class LeaderboardService {
  private reportRepo: Repo;

  constructor(opts: Container) {
    this.reportRepo = opts.repo;
  }

  async syncWeek() {
    const leaderboard = await getLeaderboard();
    await this.reportRepo.saveUsers(leaderboard.data.map(toUserModel));
    await this.reportRepo.saveWeek(toReportModel(leaderboard));
  }

  async syncDay() {
    const leaderboard = await getLeaderboard();
    await this.reportRepo.saveUsers(leaderboard.data.map(toUserModel));
    await this.reportRepo.saveDay(toReportModel(leaderboard));
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
    const report = await this.reportRepo.getTopWeekReports(size);

    if (isNull(report) || report.usages.some(u => isNull(u.user))) {
      await this.syncDay();
      return this.getDay(size);
    }

    return Leaderboard.fromReport(report);
  }
}
