import { isNull } from '@fullstacksjs/toolbox';
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from 'lowdb';

import { getWeekOfYear } from './date.js';
import { getUsers } from './getWakatimeUsers.js';
import type { ReportAndUser, User, Week, WeekReport } from './model.js';

interface Db {
  users: { [key: string]: User };
  weeks: {
    [key: Week]: WeekReport | null;
  };
}

export class WakatimeRepo {
  // @ts-expect-error I know
  db: Low<Db>;

  constructor(private path: string) {}

  async init() {
    const adapter = new JSONFile<Db>(this.path);
    this.db = new Low<Db>(adapter);
    await this.seedDb();
    return this;
  }

  async seedDb() {
    await this.db.read();
    if (!isNull(this.db.data)) return;
    this.db.data ??= { weeks: {}, users: {} };
    await this.db.write();
  }

  async saveUsers(reportAndUsers: ReportAndUser[]) {
    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());

    this.db.data!.weeks[`${currentYear}:${currentWeek}`] = {
      reports: reportAndUsers.map(({ report }) => report),
    };

    reportAndUsers.forEach(({ user }) => {
      this.db.data!.users[user.id] = {
        ...user,
        diff: (this.db.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
      };
    });

    await this.db.write();
  }

  async getTopUsers(reportAndUsers: ReportAndUser[], count: number): Promise<ReportAndUser[]> {
    await this.db.read();
    return reportAndUsers.slice(0, count).map(reportAndUser => ({
      report: reportAndUser.report,
      user: {
        ...reportAndUser.user,
        diff: this.db.data?.users[reportAndUser.user.id]?.diff ?? 0,
      },
    }));
  }

  async syncDb() {
    try {
      const users = await getUsers();
      return this.saveUsers(users);
    } catch (error) {
      console.error(error);
    }
  }
}
