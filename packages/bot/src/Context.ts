import { Context } from 'telegraf';
import { dedent } from 'ts-dedent';

export class WakatimeContext extends Context {
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
  };

  reply(...args: Parameters<Context['reply']>): ReturnType<Context['reply']> {
    return super.reply(args[0], { ...args[1], parse_mode: 'HTML' });
  }
}
