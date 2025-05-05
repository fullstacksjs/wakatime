import { deepmerge } from 'deepmerge-ts';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'node:fs/promises';
import path from 'node:path';

import type { ReportModel } from './ReportModel.ts';
import type { UserModel } from './UserModel.ts';

import { getDayId, getThisWeekId as getWeekId } from '../../utils/date.ts';
import { Report } from '../models/Report.ts';
import { User } from '../models/User.ts';

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

export interface UserFilter {
  type?: 'WithoutUsername' | 'WithUsername';
  size: number;
  page: number;
}

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User ${id} not found`);
  }
}

export class Repo {
  constructor(private db: InitializedLow<DB>) {}

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

  public async getUser(id: string): Promise<User | undefined> {
    await this.db.read();

    const user = this.db.data.users[id];
    if (!user) return;

    return User.fromModel(user);
  }

  public async getUserList({ size, page, type }: UserFilter): Promise<User[]> {
    await this.db.read();
    const users = Object.values(this.db.data.users)
      .map(User.fromModel)
      .slice(page * size, (page + 1) * size);

    switch (type) {
      case 'WithUsername':
        return users.filter(u => u.telegramUsername);
      case 'WithoutUsername':
        return users.filter(u => !u.telegramUsername);
      default:
        return users;
    }
  }

  public async saveDay(report: ReportModel) {
    await this.db.update(({ days }) => {
      const dayId = getDayId(new Date());
      days[dayId] = report;
    });
  }

  public async saveUser(user: UserModel) {
    await this.db.update(({ users }) => {
      const oldUser = users[user.id];
      users[user.id] = updateUser(oldUser, user);
    });
  }

  public async saveUsers(newUsers: UserModel[]) {
    await this.db.update(({ users }) => {
      newUsers.forEach(user => {
        const oldUser = users[user.id];
        users[user.id] = updateUser(oldUser, user);
      });
    });
  }

  public async saveWeek(report: ReportModel) {
    await this.db.update(({ weeks }) => {
      const weekId = getWeekId(new Date());
      weeks[weekId] = report;
    });
  }

  public async setTelegramUsername(id: string, username: string) {
    await this.db.update(({ users }) => {
      if (users[id] == null) throw new UserNotFoundError(id);
      users[id].telegramUsername = username;
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
