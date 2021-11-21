import { Bot as Grammy, BotConfig } from 'grammy';
import { Inject } from 'typescript-ioc';

import { GroupScheduleService } from '../Services/ScheduleService.js';
import { helpCommand } from './commands/help.js';
import { listWeekly } from './commands/listWeekly.js';
import { schedule } from './commands/schedule.js';
import { startCommand } from './commands/start.js';
import { WakatimeContext } from './Context.js';
import { parseSchedule } from './middlewares/parseSchedule.js';
import { SendWeeklyUsecase } from './useCases/SendWeeklyUsecase';

export class Bot extends Grammy<WakatimeContext> {
  @Inject() private groupScheduleService!: GroupScheduleService;

  constructor(token: string, config: BotConfig<WakatimeContext> = {}) {
    super(token, { ContextConstructor: WakatimeContext, ...config });
  }

  async initiate() {
    const sendWeekly = new SendWeeklyUsecase(this.api);
    await this.groupScheduleService.loadJobs(sendWeekly.execuet);

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

    return this;
  }
}
