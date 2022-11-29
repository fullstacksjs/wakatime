import { isNull } from '@fullstacksjs/toolbox';

import { assertNotIncludeNulls } from '../../utils/guards.js';
import { LeaderboardModel } from '../models/Leaderboard.js';
import type { ReportRepo } from '../repos/ReportRepo.js';
import type { UserRepo } from '../repos/UserRepository.js';
import type { WakatimeService } from './WakatimeService.js';

export class LeaderboardService {
  private reportRepo: ReportRepo;
  private wakatimeService: WakatimeService;
  private userRepo: UserRepo;

  constructor(opts: Container) {
    this.reportRepo = opts.reportRepo;
    this.wakatimeService = opts.wakatimeService;
    this.userRepo = opts.userRepo;
  }

  async sync() {
    const leaderboard = await this.wakatimeService.getLeaderboard();
    await this.userRepo.saveUsers(leaderboard.getUsers());
    await this.reportRepo.saveReports(leaderboard.getReports());
  }

  async getLeaderboard(size: number = 3): Promise<LeaderboardModel> {
    const reports = await this.reportRepo.getTopReports(size);

    if (isNull(reports)) {
      await this.sync();
      return this.getLeaderboard(size);
    }

    const users = await Promise.all(reports.map(report => this.userRepo.get(report.userId)));
    assertNotIncludeNulls(users);

    return LeaderboardModel.fromPersistance({ reports, users });
  }
}
