import dedent from 'dedent';
import { Context, InputFile } from 'grammy';

import { container } from '../config/container.ts';

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
    const hasReportId = container.cradle.config.bot.reportId;
    const isReportChat =
      this.update.channel_post?.sender_chat?.id === container.cradle.config.bot.reportId;
    const hasMessageId = this.update.message?.message_id;
    const isAdmin = this.update.message?.from.id === container.cradle.config.bot.adminId;

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return (hasMessageId && isAdmin) || (hasReportId && isReportChat);
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
    const reportId = container.cradle.config.bot.reportId;
    if (!reportId) return;

    return container.cradle.grammy.sendMessage(reportId, `ℹ️\n${log}`, { parse_mode: 'HTML' });
  }

  public reportError(error: string) {
    const reportId = container.cradle.config.bot.reportId;
    if (!reportId) return;

    const grammy = container.cradle.grammy;
    return grammy.sendMessage(reportId, `❗️ ${error}`, { parse_mode: 'HTML' });
  }

  public sendLeaderboard(image: Uint8Array, title: string) {
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
