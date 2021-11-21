import { Context } from 'grammy';
import { PuppeteerService } from 'src/Services/PuppeteerService.js';
import { dedent } from 'ts-dedent';
import { Inject, InjectValue } from 'typescript-ioc';

import { LeaderboardRepo } from '../repos/LeaderboardRepo.js';
import { ScheduleRepo } from '../repos/ScheduleRepo.js';
import { GroupScheduleService } from '../Services/ScheduleService.js';
import { LeaderboardUseCase } from './useCases/LeaderboardUsecase.js';

export class WakatimeContext extends Context {
  @InjectValue('config') config!: Config;
  @Inject() wakatimeDb!: LeaderboardRepo;
  @Inject() scheduleDb!: ScheduleRepo;
  @Inject() groupScheduleService!: GroupScheduleService;
  @Inject() puppeteerService!: PuppeteerService;

  schedule: Schedule | null = null;
  getLeaderboardImage() {
    return this.puppeteerService.getScreenshot({
      url: this.config.webpageUrl,
      puppeteerExecutablePath: this.config.puppeteerExecutablePath,
      encoding: 'binary',
      type: 'png',
      width: 815,
      height: 700,
      deviceScaleFactor: 2,
      timeout: 2000,
    });
  }

  getLeaderboard(): Promise<Leaderboard> {
    return new LeaderboardUseCase().execute();
  }

  messages = {
    help: dedent`
      You can control me by sending these commands:
      /help - to see this help.
      /list_weekly - see list of best coder during current week



      Report <b>Bugs</b>: @Hoseinprd
    `,

    welcome: dedent`
      👋 Hello, Welcome <b>${this.from?.first_name}</b>!
      🎯 This bot will give you latest stats of wakatime per weeks.
      Press /help to get the list of available commands.
      `,

    badSchedulePattern: dedent`
    bad pattern
    an accepted pattern is in this format:
    <code>\\schedule DD HH:MM</code>
    note: days start from 1 (saturday) to 7 (friday)`,

    notAGroup: dedent`
    this command is only available in group chats
    `,

    scheduleSaved: dedent`
    schedule saved successfully
    `,
  };

  override reply(...args: Parameters<Context['reply']>): ReturnType<Context['reply']> {
    return super.reply(args[0], { ...args[1], parse_mode: 'HTML' });
  }

  isGroup() {
    return this.chat?.type === 'supergroup' || this.chat?.type === 'group';
  }
}
