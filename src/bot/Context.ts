import { Context } from 'grammy';
import { dedent } from 'ts-dedent';

import { ScheduleRepo } from '../ScheduleRepo.js';
import { ScheduleService } from '../ScheduleService.js';
import { getScreenshot } from '../utils/getScreenshot.js';
import { WakatimeRepo } from '../WakatimeRepo.js';
import { createLeaderboard } from './useCases/createLeaderboard.js';

export class WakatimeContext extends Context {
  // @ts-expect-error the DB will get initiated dynamically due to lack of control from TelegrafContext
  wakatimeDb: WakatimeRepo;
  // @ts-expect-error the config will get initiated dynamically due to lack of control from TelegrafContext
  scheduleDb: ScheduleRepo;
  // @ts-expect-error the config will get initiated dynamically due to lack of control from TelegrafContext
  config: Config;
  // @ts-expect-error the config will get initiated dynamically due to lack of control from TelegrafContext
  scheduleService: ScheduleService;

  schedule: Schedule | null = null;
  getLeaderboardImage() {
    return getScreenshot({
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

  getLeaderboard() {
    return createLeaderboard(this.config, this.wakatimeDb);
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
    <code>\\schedule DAY HH:MM</code>`,

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
