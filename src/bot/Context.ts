import { Context } from 'grammy';
import { dedent } from 'ts-dedent';

import { container } from '../config/container';

export class WakatimeContext extends Context {
  schedule: Schedule | null = null;

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

    usernameSet: dedent`
    ✅ Done
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

  public replyToMessage(...args: Parameters<Context['reply']>): ReturnType<Context['reply']> {
    return this.reply(args[0], { reply_to_message_id: this.update.message?.message_id });
  }

  public isAdmin() {
    return this.update.message?.from?.id === container.cradle.config.admin;
  }

  isGroup() {
    return this.chat?.type === 'supergroup' || this.chat?.type === 'group';
  }
}
