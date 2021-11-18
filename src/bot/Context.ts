import { Context } from 'telegraf';
import { dedent } from 'ts-dedent';

import { secondsToHours } from '../utils/date.js';
import { getScreenshot } from '../utils/getScreenshot.js';
import { WakatimeRepo } from '../WakatimeRepo.js';
import { getWeekOfYear } from '../web/js/app.js';

export class WakatimeContext extends Context {
  medals = ['🥇', '🥈', '🥉'];
  // @ts-expect-error the DB will get initiated dynamically due to lack of control from TelegrafContext
  db: WakatimeRepo;
  // @ts-expect-error the config will get initiated dynamically due to lack of control from TelegrafContext
  config: Config;

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

  messages = {
    getReportTitle: (users: ReportAndUser[]) => dedent`
    <b>Wakatime Report</b>
    <i>${new Date().getFullYear()} - Week ${getWeekOfYear(new Date())} </i>
    ${users
      .map(
        ({ user }, idx: number) =>
          `${this.medals[idx]} <b>${user.name}</b>: <i>~${secondsToHours(
            user.lastTotalSeconds ?? 0,
          )}hrs</i>`,
      )
      .join('\n')}

    #wakatime_report

    @fullstacks
    `,

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
  };

  override reply(...args: Parameters<Context['reply']>): ReturnType<Context['reply']> {
    return super.reply(args[0], { ...args[1], parse_mode: 'HTML' });
  }
}
