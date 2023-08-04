import { deepmerge } from 'deepmerge-ts';
import fs from 'fs/promises';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

import { getDayId, getThisWeekId as getWeekId } from '../../utils/date.js';
import { Report } from '../models/Report.js';
import { User } from '../models/User.js';
import type { ReportModel } from './ReportModel.js';
import type { UserModel } from './UserModel.js';

interface DB {
  weeks: Record<string, ReportModel>;
  days: Record<string, ReportModel>;
  users: Record<string, UserModel>;
}

export type InitializedLow<T> = Omit<Low<T>, 'data'> & { data: T };

const updateUser = (oldUser: UserModel | undefined, user: UserModel): UserModel =>
  deepmerge(oldUser ?? {}, user, {
    diff: oldUser?.lastRank != null ? oldUser.lastRank - user.lastRank : 0,
  }) as UserModel;

export type UserFilter = 'WithoutUsername' | 'WithUsername' | undefined;

export class Repo {
  constructor(private db: InitializedLow<DB>) {}

  public async saveUser(user: UserModel) {
    await this.db.read();
    const oldUser = this.db.data.users[user.id];
    this.db.data.users[user.id] = updateUser(oldUser, user);

    await this.db.write();
  }

  public async setTelegramUsername(id: string, username: string) {
    await this.db.read();

    if (this.db.data.users[id] == null) throw Error('User not found');
    this.db.data.users[id]!.telegramUsername = username;

    await this.db.write();
  }

  public async saveUsers(users: UserModel[]) {
    await this.db.read();

    users.forEach(user => {
      const oldUser = this.db.data.users[user.id];
      this.db.data.users[user.id] = updateUser(oldUser, user);
    });

    await this.db.write();
  }

  public async getUser(id: string): Promise<User | undefined> {
    await this.db.read();

    const user = this.db.data.users[id];
    if (!user) return;

    return User.fromModel(user);
  }

  public async getUserList(filter?: UserFilter): Promise<User[]> {
    await this.db.read();
    const users = Object.values(this.db.data.users).map(User.fromModel);

    switch (filter) {
      case 'WithUsername':
        return users.filter(u => u.telegramUsername);
      case 'WithoutUsername':
        return users.filter(u => !u.telegramUsername);
      default:
        return users;
    }
  }

  public async saveWeek(report: ReportModel) {
    const weekId = getWeekId(new Date());
    this.db.data.weeks[weekId] = report;

    await this.db.write();
  }

  public async saveDay(report: ReportModel) {
    const dayId = getDayId(new Date());
    this.db.data.days[dayId] = report;

    await this.db.write();
  }

  public async getTopDayReport(count: number): Promise<Report | undefined> {
    await this.db.read();

    const dayId = getDayId(new Date());
    const report = this.db.data.days[dayId];
    if (!report) return;

    return Report.fromModel({
      date: report.date,
      usages: report.usages
        .slice(0, count)
        .map(r => ({ ...r, user: this.db.data.users[r.userId] })),
    });
  }

  public async getTopWeekReports(count: number): Promise<Report | undefined> {
    await this.db.read();
    const weekId = getWeekId(new Date());
    const report = this.db.data.weeks[weekId];

    if (!report) return;

    return Report.fromModel({
      date: report.date,
      usages: report.usages.slice(0, count).map(r => {
        return { ...r, user: this.db.data.users[r.userId] };
      }),
    });
  }
}

export async function createRepo(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const adapter = new JSONFile<DB>(filePath);
  const db = new Low<DB>(adapter, { days: {}, users: {}, weeks: {} });
  await db.read();

  return new Repo(db as unknown as InitializedLow<DB>);
}
