import assert from 'node:assert/strict';
import test from 'node:test';

import type { Container } from '../../config/initContainer.ts';
import type { UserModel } from '../repos/UserModel.ts';

import { Report } from '../models/Report.ts';
import { captureScreenshot, LeaderboardService } from './LeaderboardService.ts';

const user: UserModel = {
  avatar: '',
  id: 'test-user',
  languages: [],
  lastDailyAverage: 1_000,
  lastRank: 1,
  lastTotalSeconds: 3_000,
  name: 'Test User',
  username: 'test',
};

const createReport = (size: number): Report =>
  Report.fromModel({
    date: new Date(),
    usages: Array.from({ length: size }, (_, index) => ({
      dailyAverage: 1_000,
      rank: index + 1,
      totalSeconds: 3_000,
      user: { ...user, id: `test-user-${index}` },
      userId: `test-user-${index}`,
    })),
  });

const createService = (reports: Report[]) => {
  let fetchCount = 0;
  let reportIndex = 0;
  const reportRepo = {
    getTopDayReport: () => {
      const report = reports[Math.min(reportIndex, reports.length - 1)];
      reportIndex += 1;
      return report;
    },
    hasUsersMissingLanguageData: () => false,
    initializeMissingLanguages: () => undefined,
    saveDay: () => undefined,
    saveUsers: () => undefined,
  };
  const wakatime = {
    getReports: () => {
      fetchCount += 1;
      return { data: [], modified_at: new Date().toISOString() };
    },
  };
  const service = new LeaderboardService({
    config: {} as Config,
    repo: reportRepo,
    wakatime,
  } as unknown as Container);

  return { getFetchCount: () => fetchCount, service };
};

test('refreshes an undersized cached day report', async () => {
  const { getFetchCount, service } = createService([createReport(1), createReport(10)]);
  const leaderboard = await service.getDay(10);

  assert.equal(getFetchCount(), 1);
  assert.equal(leaderboard.report.usages.length, 10);
});

test('does not retry forever when WakaTime has fewer users than requested', async () => {
  const { getFetchCount, service } = createService([createReport(1)]);
  const leaderboard = await service.getDay(10);

  assert.equal(getFetchCount(), 1);
  assert.equal(leaderboard.report.usages.length, 1);
});

test('closes the browser when screenshot setup fails', async () => {
  let closed = 0;

  await assert.rejects(
    () =>
      captureScreenshot('http://example.test', {
        createBrowser: async () => ({
          close: async () => {
            closed += 1;
          },
        }),
        openPage: async () => {
          throw new Error('open failed');
        },
        getScreenshot: async () => new Uint8Array(),
      }),
    /open failed/,
  );

  assert.equal(closed, 1);
});

test('closes the browser after a successful screenshot', async () => {
  let closed = 0;
  const image = new Uint8Array([1, 2, 3]);

  const result = await captureScreenshot('http://example.test', {
    createBrowser: async () => ({
      close: async () => {
        closed += 1;
      },
    }),
    openPage: async () => ({}),
    getScreenshot: async () => image,
  });

  assert.equal(result, image);
  assert.equal(closed, 1);
});
