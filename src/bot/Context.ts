import { Context, InputFile } from 'grammy';
import { dedent } from 'ts-dedent';

import { container } from '../config/container.js';

export class WakatimeContext extends Context {
  messages = {
    help: dedent`
      Commands:
      /help - to see this help.
      /week - see list of best coder during current week
      /day - see list of best coder during current day
      /set - set username for an id

      Report <b>Bugs</b>: @Fullstacksjs
    `,

    welcome: dedent`
      👋 Hello, Welcome <b>${this.from?.first_name}</b>!
      🎯 This bot will give you latest stats of wakatime per weeks.
      Press /help to get the list of available commands.
    `,

    usernameSet: dedent`
      ✅ Done
    `,

    notAGroup: dedent`
      this command is only available in group chats
    `,

    unAuthorized: dedent`
      Why are you gay?
    `,
  };

  schedule: Schedule | null = null;

  public isAdmin() {
    return this.update.message?.from.id === container.cradle.config.admin;
  }

  isGroup() {
    return this.chat?.type === 'supergroup' || this.chat?.type === 'group';
  }

  override reply(...args: Parameters<Context['reply']>): ReturnType<Context['reply']> {
    return super.reply(args[0], { ...args[1], parse_mode: 'HTML' });
  }

  public replyToMessage(...args: Parameters<Context['reply']>): ReturnType<Context['reply']> {
    return this.reply(args[0], { reply_to_message_id: this.update.message?.message_id });
  }

  public report(log: string) {
    const reportId = container.cradle.config.reportId;
    return container.cradle.grammy.sendMessage(reportId, `ℹ️\n${log}`, { parse_mode: 'HTML' });
  }

  public reportError(error: string) {
    const reportId = container.cradle.config.reportId;
    return container.cradle.grammy.sendMessage(reportId, `❗️\n${error}`, { parse_mode: 'HTML' });
  }

  public sendLeaderboard(image: Buffer, title: string) {
    const groupId = this.chat!.id.toString();
    const threadId = this.message?.message_thread_id;

    try {
      return container.cradle.grammy.sendPhoto(groupId, new InputFile(image), {
        caption: title,
        parse_mode: 'HTML',
        message_thread_id: threadId,
      });
    } catch (error) {
      console.error(error);
      return container.cradle.grammy.sendMessage(groupId, 'Oops! try again');
    }
  }
}
