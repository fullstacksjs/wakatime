import assert from 'node:assert/strict';
import test from 'node:test';

import type { UserModel } from './UserModel.ts';

import { User } from '../models/User.ts';
import { updateUser } from './Repo.ts';
import { toUserModel } from './UserModel.ts';

const createDto = (languages: LanguageReport[]): WakatimeDto => ({
  rank: 1,
  running_total: {
    daily_average: 1_000,
    total_seconds: 3_000,
    human_readable_daily_average: '16 mins',
    human_readable_total: '50 mins',
    languages,
  },
  user: {
    display_name: 'Test User',
    email: null,
    full_name: 'Test User',
    human_readable_website: '',
    id: 'test-user',
    is_email_public: false,
    is_hireable: false,
    location: '',
    photo: '',
    photo_public: true,
    username: 'test',
    website: '',
  },
});

test('maps WakaTime languages and sorts them by descending usage', () => {
  const user = toUserModel(
    createDto([
      { name: 'TypeScript', total_seconds: 700 },
      { name: 'JavaScript', total_seconds: 1_500 },
      { name: 'CSS', total_seconds: 700 },
    ]),
  );

  assert.deepEqual(user.languages, [
    { name: 'JavaScript', totalSeconds: 1_500 },
    { name: 'CSS', totalSeconds: 700 },
    { name: 'TypeScript', totalSeconds: 700 },
  ]);
});

test('returns persisted languages sorted by descending usage', () => {
  const user = User.fromModel({
    avatar: '',
    id: 'test-user',
    languages: [
      { name: 'TypeScript', totalSeconds: 700 },
      { name: 'JavaScript', totalSeconds: 1_500 },
    ],
    lastDailyAverage: 1_000,
    lastRank: 1,
    lastTotalSeconds: 3_000,
    name: 'Test User',
    username: 'test',
  });

  assert.deepEqual(user.languages, [
    { name: 'JavaScript', totalSeconds: 1_500 },
    { name: 'TypeScript', totalSeconds: 700 },
  ]);
});

test('replaces the previous language snapshot when updating a user', () => {
  const user: UserModel = {
    avatar: '',
    id: 'test-user',
    languages: [{ name: 'TypeScript', totalSeconds: 700 }],
    lastDailyAverage: 1_000,
    lastRank: 1,
    lastTotalSeconds: 3_000,
    name: 'Test User',
    username: 'test',
  };
  const updated = updateUser(
    {
      ...user,
      languages: [{ name: 'JavaScript', totalSeconds: 1_500 }],
      telegramUsername: 'test-user',
    },
    user,
  );

  assert.deepEqual(updated.languages, [{ name: 'TypeScript', totalSeconds: 700 }]);
  assert.equal(updated.telegramUsername, 'test-user');
});
