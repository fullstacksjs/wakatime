import type { WakatimeRepo } from 'src/WakatimeRepo.js';
import { Telegraf } from 'telegraf';

import { helpCommand } from './commands/help.js';
import { listWeekly } from './commands/listWeekly.js';
import { startCommand } from './commands/start.js';
import { WakatimeContext } from './Context.js';

export const createBot = (config: Config, db: WakatimeRepo) => {
  const bot = new Telegraf(config.botToken, {
    contextType: WakatimeContext,
    // telegram: {
    //   apiRoot: 'https://tgproxy-m.herokuapp.com/',
    // },
  });
  bot.context.db = db;
  bot.context.config = config;
  bot.start(startCommand);
  bot.help(helpCommand);
  bot.command('list_weekly', listWeekly);

  return bot;
};
