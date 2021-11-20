import { Bot } from 'grammy';
import type { WakatimeRepo } from 'src/WakatimeRepo.js';

import { ScheduleRepo } from '../ScheduleRepo.js';
import { ScheduleService } from '../ScheduleService.js';
import { helpCommand } from './commands/help.js';
import { listWeekly } from './commands/listWeekly.js';
import { schedule } from './commands/schedule.js';
import { startCommand } from './commands/start.js';
import { WakatimeContext } from './Context.js';
import { parseSchedule } from './middlewares/parseSchedule.js';
import { createSendWeekly } from './useCases/createSendWeekly';

export const createBot = async (
  config: Config,
  wakatimeDb: WakatimeRepo,
  scheduleDb: ScheduleRepo,
) => {
  const bot = new Bot(config.botToken, {
    ContextConstructor: WakatimeContext,

    // telegram: {
    //   apiRoot: 'https://tgproxy-m.herokuapp.com/',
    // },
  });
  const sendWeekly = createSendWeekly(config, wakatimeDb, bot.api);
  const scheduleService = await new ScheduleService(scheduleDb, sendWeekly).init();

  bot.use(async (ctx, next) => {
    ctx.wakatimeDb = wakatimeDb;
    ctx.scheduleDb = scheduleDb;
    ctx.config = config;
    ctx.scheduleService = scheduleService;
    await next();
  });
  await bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Show help text' },
    { command: 'list_weekly', description: 'list the current week leaderboard' },
    {
      command: 'schedule',
      description:
        'schedule leaderboard to be send each week on DD at HH:MM (days start from 1 (saturday) to 7(friday))',
    },
  ]);

  bot.command('start', startCommand);
  bot.command('help', helpCommand);
  bot.command('list_weekly', listWeekly);
  bot.hears(/\/schedule ([1-7]) ([0-1]?[0-9]|2[0-3]):([0-5][0-9])/, parseSchedule, schedule);
  bot.hears(/\/schedule/, ctx => ctx.reply(ctx.messages.badSchedulePattern));
  return bot;
};
