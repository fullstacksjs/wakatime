import type { WakatimeContext } from '../Context.js';
import { sendLeaderboard } from '../sendLeaderboard.js';

export function week(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');

  return sendLeaderboard(ctx.chat.id.toString(), ctx.message?.message_thread_id);
}
