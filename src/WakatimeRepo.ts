import { isNull } from '@fullstacksjs/toolbox';
import fs from 'fs/promises';
import { JSONFile, Low } from 'lowdb';
import path from 'path';

import { getUsers } from './getUsers.js';
import { getWeekOfYear } from './utils/date.js';

interface Db {
  users: { [key: string]: User };
  weeks: {
    [key: Week]: WeekReport | null;
  };
}

export class WakatimeRepo {
  db: Low<Db> | undefined;

  constructor(private dbFilePath: string) {}

  async init() {
    await fs.mkdir(path.dirname(this.dbFilePath), { recursive: true });
    const adapter = new JSONFile<Db>(this.dbFilePath);
    this.db = new Low<Db>(adapter);
    await this.seedDb();
    return this;
  }

  async seedDb() {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();
    if (!isNull(this.db.data)) return;
    this.db.data ??= { weeks: {}, users: {} };
    await this.db.write();
  }

  async saveUsers(reportAndUsers: ReportAndUser[]) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());

    this.db.data!.weeks[`${currentYear}:${currentWeek}`] = {
      reports: reportAndUsers.map(({ report }) => report),
    };

    reportAndUsers.forEach(({ user }) => {
      this.db!.data!.users[user.id] = {
        ...user,
        diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
      };
    });

    await this.db.write();
  }

  async getTopUsers(count: number): Promise<ReportAndUser[]> {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.syncDb();
    await this.db.read();

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());
    const currentWeekReports = this.db.data!.weeks[`${currentYear}:${currentWeek}`]!.reports;
    return currentWeekReports.slice(0, count + 1).map(
      (report): ReportAndUser => ({
        report,
        user: this.db!.data!.users[report.userId] as User,
      }),
    );
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
