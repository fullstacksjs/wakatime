import { isNull } from '@fullstacksjs/toolbox';
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from 'lowdb';

import { getWeekOfYear } from './date.js';
import type { ReportAndUser, User, Week, WeekReport } from './model.js';

interface Db {
  users: { [key: string]: User };
  weeks: {
    [key: Week]: WeekReport | null;
  };
}

async function seedDb(db: Low<Db>) {
  await db.read();
  if (!isNull(db.data)) return;
  db.data ??= { weeks: {}, users: {} };
  await db.write();
}

export async function initDb(path: string): Promise<Low<Db>> {
  const adapter = new JSONFile<Db>(path);
  const db = new Low<Db>(adapter);
  await seedDb(db);
  return db;
}

export async function saveUsers(db: Low<Db>, reportAndUsers: ReportAndUser[]) {
  const currentYear = new Date().getFullYear();
  const currentWeek = getWeekOfYear(new Date());

  db.data!.weeks[`${currentYear}:${currentWeek}`] = {
    reports: reportAndUsers.map(({ report }) => report),
  };

  reportAndUsers.forEach(({ user }) => {
    db.data!.users[user.id] = {
      ...user,
      diff: (db.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
    };
  });

  await db.write();
}

export async function getTopUsers(
  db: Low<Db>,
  reportAndUsers: ReportAndUser[],
  count: number,
): Promise<ReportAndUser[]> {
  await db.read();
  return reportAndUsers.slice(0, count).map(reportAndUser => ({
    report: reportAndUser.report,
    user: {
      ...reportAndUser.user,
      diff: db.data?.users[reportAndUser.user.id]?.diff ?? 0,
    },
  }));
}
