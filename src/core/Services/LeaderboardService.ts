import { isNull } from '@fullstacksjs/toolbox';

import { LeaderboardModel } from '../models/Leaderboard';
import { User } from '../models/User';
import type { ReportRepo } from '../repos/ReportRepo';
import { UserRepo } from '../repos/UserRepository';
import type { PuppeteerService } from './PuppeteerService';
import { WakatimeService } from './WakatimeService';

export class LeaderboardService {
  private config: Config;
  private reportRepo: ReportRepo;
  private puppeteerService: PuppeteerService;
  private wakatimeService: WakatimeService;
  private userRepo: UserRepo;

  constructor(opts: Container) {
    this.config = opts.config;
    this.reportRepo = opts.reportRepo;
    this.puppeteerService = opts.puppeteerService;
    this.wakatimeService = opts.wakatimeService;
    this.userRepo = opts.userRepo;
  }

  async sync() {
    const leaderboard = await this.wakatimeService.getLeaderboard();
    await this.userRepo.saveUsers(leaderboard.getUsers());
    await this.reportRepo.saveReports(leaderboard.getReports());
  }

  async getLeaderboard(size: number = 3): Promise<LeaderboardModel> {
    // await this.sync();
    const reports = await this.reportRepo.getTopReports(size);
    const users = await Promise.all(reports.map(report => this.userRepo.get(report.userId)));
    if (users.some(isNull)) throw Error('User not found');

    return LeaderboardModel.fromPersistance({
      reports,
      users: users as User[],
    });
  }
}
