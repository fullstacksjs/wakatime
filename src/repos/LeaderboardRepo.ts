import { isNull } from '@fullstacksjs/toolbox';
import { Report } from 'src/models/Report';
import { WakatimeService } from 'src/Services/WakatimeService.js';
import { Inject } from 'typescript-ioc';

import { LeaderboardModel } from '../models/Leaderboard';
import { User } from '../models/User';
import { getWeekOfYear } from '../utils/date.js';
import { BaseRepo } from './BaseRepo';

interface WakatimeDb {
  users: { [key: string]: User };
  weeks: {
    [key: Week]: Report[] | null;
  };
}

export class LeaderboardRepo extends BaseRepo<WakatimeDb> {
  @Inject() private wakatimeService!: WakatimeService;

  async saveLeaderboard(leaderboard: LeaderboardModel) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());

    this.db.data!.weeks[`${currentYear}:${currentWeek}`] = leaderboard.getReports();

    leaderboard.userReports.forEach(({ user }) => {
      this.db!.data!.users[user.id] = {
        ...user,
        diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
      };
    });

    await this.db.write();
  }

  async getTopUsers(count: number): Promise<LeaderboardModel> {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.syncDb();
    await this.db.read();

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());
    const currentWeekReports = this.db.data!.weeks[`${currentYear}:${currentWeek}`]!;
    return LeaderboardModel.fromPersistance(currentWeekReports.slice(3));
  }

  async syncDb() {
    try {
      const leaderboard = await this.wakatimeService.getLeaderboard();
      return this.saveLeaderboard(leaderboard);
    } catch (error) {
      console.error(error);
    }
  }
}
