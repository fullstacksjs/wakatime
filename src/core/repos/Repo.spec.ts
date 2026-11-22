import assert from 'node:assert/strict';
import test from 'node:test';

import type { UserModel } from './UserModel.ts';

import { Repo } from './Repo.ts';

function user(id: string, telegramUsername?: string): UserModel {
  return {
    avatar: '',
    id,
    languages: [],
    lastDailyAverage: 0,
    lastRank: 1,
    lastTotalSeconds: 0,
    name: id,
    telegramUsername,
    username: id,
  };
}

function createRepo(users: Record<string, UserModel>) {
  return new Repo({
    data: { days: {}, users, weeks: {} },
    read: async () => undefined,
  } as never);
}

test('getUserList filters before paginating', async () => {
  const repo = createRepo({
    a: user('a'),
    b: user('b', 'bob'),
    c: user('c'),
    d: user('d', 'dan'),
    e: user('e'),
  });

  const page0 = await repo.getUserList({ size: 2, page: 0, type: 'WithoutUsername' });
  const page1 = await repo.getUserList({ size: 2, page: 1, type: 'WithoutUsername' });

  assert.deepEqual(
    page0.map(u => u.id),
    ['a', 'c'],
  );
  assert.deepEqual(
    page1.map(u => u.id),
    ['e'],
  );
});

test('getUserList returns an empty page only when no matches remain', async () => {
  const repo = createRepo({
    a: user('a', 'alice'),
    b: user('b'),
    c: user('c', 'cara'),
  });

  const page = await repo.getUserList({ size: 2, page: 0, type: 'WithoutUsername' });

  assert.deepEqual(
    page.map(u => u.id),
    ['b'],
  );
});
