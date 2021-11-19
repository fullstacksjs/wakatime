import { Bot } from 'grammy';
import type { WakatimeRepo } from 'src/WakatimeRepo.js';

import { helpCommand } from './commands/help.js';
import { listWeekly } from './commands/listWeekly.js';
import { startCommand } from './commands/start.js';
import { WakatimeContext } from './Context.js';

export const createBot = (config: Config, db: WakatimeRepo) => {
  const bot = new Bot(config.botToken, {
    ContextConstructor: WakatimeContext,
    // telegram: {
    //   apiRoot: 'https://tgproxy-m.herokuapp.com/',
    // },
  });
  bot.use((ctx, next) => {
    ctx.db = db;
    ctx.config = config;
    next();
  });

  bot.command('start', startCommand);
  bot.command('help', helpCommand);
  bot.command('list_weekly', listWeekly);

  return bot;
};
