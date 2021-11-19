import { Bot } from 'grammy';
import type { WakatimeRepo } from 'src/WakatimeRepo.js';

import { ScheduleRepo } from '../ScheduleRepo.js';
import { helpCommand } from './commands/help.js';
import { listWeekly } from './commands/listWeekly.js';
import { schedule } from './commands/schedule.js';
import { startCommand } from './commands/start.js';
import { WakatimeContext } from './Context.js';
import { parseSchedule } from './middlewares/parseSchedule.js';

export const createBot = (config: Config, wakatimeDb: WakatimeRepo, scheduleDb: ScheduleRepo) => {
  const bot = new Bot(config.botToken, {
    ContextConstructor: WakatimeContext,

    // telegram: {
    //   apiRoot: 'https://tgproxy-m.herokuapp.com/',
    // },
  });
  bot.use((ctx, next) => {
    ctx.wakatimeDb = wakatimeDb;
    ctx.scheduleDb = scheduleDb;
    ctx.config = config;
    next();
  });

  bot.command('start', startCommand);
  bot.command('help', helpCommand);
  bot.command('list_weekly', listWeekly);
  bot.hears(/\/schedule ([1-7]) ([0-1]?[0-9]|2[0-3]):[0-5][0-9]/, parseSchedule, schedule);
  bot.hears(/\/schedule/, ctx =>
    ctx.reply(ctx.messages.badSchedulePattern, {
      parse_mode: 'HTML',
    }),
  );
  return bot;
};
