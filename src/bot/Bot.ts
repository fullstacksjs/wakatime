import awilix from 'awilix';
import { Bot as Grammy, webhookCallback } from 'grammy';
import { limit } from "@grammyjs/ratelimiter";

import { container } from '../config/container.js';
import { GroupScheduleService } from '../core/Services/ScheduleService.js';
import { helpCommand } from './commands/help.js';
import { listWeekly } from './commands/listWeekly.js';
import { schedule } from './commands/schedule.js';
import { startCommand } from './commands/start.js';
import { WakatimeContext } from './Context.js';
import { parseSchedule } from './middleware/parseSchedule.js';
import { sendLeaderboard } from './sendLeaderboard.js';

// config Limit Request Users



Bot.use(
  limit({
    // Allow only 3 messages to be handled every 2 seconds.
    timeFrame: 2000,

    limit: 3,

    // "MEMORY_STORE" is the default value. If you do not want to use Redis, do not pass storageClient at all.
    storageClient: 'MEMORY_STORE',

    // This is called when the limit is exceeded.
    onLimitExceeded: async ctx => {
      await ctx.reply('Please refrain from sending too many requests!');
    },

    // Note that the key should be a number in string format such as "123456789".
    keyGenerator: ctx => {
      return ctx.from?.id.toString();
    },
  })
);
export class Bot extends Grammy<WakatimeContext> {
  private groupScheduleService: GroupScheduleService;

  constructor(opts: Container) {
    super(opts.config.botToken, { ContextConstructor: WakatimeContext });
    this.groupScheduleService = opts.groupScheduleService;
    container.register({ api: awilix.asValue(this.api) });
  }

  async initiate() {
    await this.groupScheduleService.loadJobs(sendLeaderboard);

    await this.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Show help text' },
      { command: 'list_weekly', description: 'list the current week leaderboard' },
      {
        command: 'schedule',
        description:
          'schedule leaderboard to be send each week on DD at HH:MM (days start from 1 (saturday) to 7(friday))',
      },
    ]);
    this.command('start', startCommand);
    this.command('help', helpCommand);
    this.command('list_weekly', listWeekly);
    this.hears(/\/schedule ([1-7]) ([0-1]?[0-9]|2[0-3]):([0-5][0-9])/, parseSchedule, schedule);
    this.hears(/\/schedule/, ctx => ctx.reply(ctx.messages.badSchedulePattern));
  }

  createExpressWebhookCallback() {
    return webhookCallback(this, 'express', 'return', 50_000);
  }
}
