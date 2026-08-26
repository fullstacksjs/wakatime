import { toDecimal } from '@fullstacksjs/toolbox';
import * as v from 'valibot';

import { optionalEnv, requiredEnv } from '../utils/env.ts';
import { toAbsolutePath } from '../utils/path.ts';

const decimalEnv = v.pipe(
  v.string(),
  v.transform(x => toDecimal(x)),
);

const schema = v.object({
  bot: v.object({
    token: v.string(),
    webhookUrl: v.optional(v.string()),
    port: decimalEnv,
    reportId: v.optional(decimalEnv),
    defaultChatId: v.optional(decimalEnv),
    defaultTopicId: v.optional(decimalEnv),
    adminId: decimalEnv,
    api: v.string(),
  }),
  api: v.object({
    port: decimalEnv,
    dbFilePath: v.string(),
    token: v.string(),
  }),
  wakatime: v.object({
    apiKey: v.string(),
    leaderboardUrl: v.string(),
    webpageUrl: v.string(),
  }),
  puppeteerExecPath: v.optional(v.string()),
});

export function getConfig(): Config {
  return v.parse(schema, {
    bot: {
      token: requiredEnv('BOT_TOKEN'),
      webhookUrl: optionalEnv('BOT_WEBHOOK_URL'),
      port: optionalEnv('BOT_PORT', '3000'),
      reportId: optionalEnv('BOT_REPORT_ID'),
      defaultChatId: optionalEnv('BOT_DEFAULT_CHAT_ID'),
      defaultTopicId: optionalEnv('BOT_DEFAULT_TOPIC_ID'),
      adminId: requiredEnv('BOT_ADMIN_ID'),
      api: requiredEnv('BOT_API_ENDPOINT'),
    },
    api: {
      port: optionalEnv('API_PORT', '4000'),
      dbFilePath: toAbsolutePath('../data/db.json'),
      token: requiredEnv('API_TOKEN'),
    },
    wakatime: {
      apiKey: requiredEnv('WAKATIME_API_KEY'),
      leaderboardUrl: requiredEnv('WAKATIME_LEADERBOARD_URL'),
      webpageUrl: requiredEnv('WAKATIME_PAGE_URL'),
    },
    puppeteerExecPath: optionalEnv('PUPPETEER_EXECUTABLE_PATH'),
  });
}
