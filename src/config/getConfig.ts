/* eslint-disable n/no-process-env */
import { toDecimal } from '@fullstacksjs/toolbox';
import * as v from 'valibot';

import { toAbsolutePath } from '../utils/path.ts';

const schema = v.object({
  bot: v.object({
    token: v.string(),
    webhookUrl: v.string(),
    port: v.optional(
      v.pipe(
        v.string(),
        v.transform(x => toDecimal(x)),
      ),
      '3000',
    ),
    reportId: v.optional(
      v.pipe(
        v.string(),
        v.transform(x => toDecimal(x)),
      ),
    ),
    adminId: v.pipe(
      v.string(),
      v.transform(x => toDecimal(x)),
    ),
    api: v.string(),
  }),
  api: v.object({
    port: v.optional(
      v.pipe(
        v.string(),
        v.transform(x => toDecimal(x)),
      ),
      '4000',
    ),
    dbFilePath: v.string(),
  }),
  wakatime: v.object({
    apiKey: v.string(),
    leaderboardUrl: v.string(),
    webpageUrl: v.string(),
  }),
  advent: v.object({
    webpageUrl: v.string(),
  }),
  puppeteerExecPath: v.optional(v.string()),
});

export function getConfig(): Config {
  return v.parse(schema, {
    bot: {
      token: process.env['BOT_TOKEN'],
      webhookUrl: process.env['BOT_WEBHOOK_URL'],
      port: process.env['BOT_PORT'],
      reportId: process.env['BOT_REPORT_ID'],
      adminId: process.env['BOT_ADMIN_ID'],
      api: process.env['BOT_API_ENDPOINT'],
    },
    api: {
      port: process.env['API_PORT'],
      dbFilePath: toAbsolutePath('../data/db.json'),
    },
    wakatime: {
      apiKey: process.env['WAKATIME_API_KEY'],
      leaderboardUrl: process.env['WAKATIME_LEADERBOARD_URL'],
      webpageUrl: process.env['WAKATIME_PAGE_URL'],
    },
    advent: {
      webpageUrl: process.env['ADVENT_PAGE_URL'],
    },
    puppeteerExecPath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  });
}
