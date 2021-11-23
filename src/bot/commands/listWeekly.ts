import { WakatimeContext } from '../Context.js';
import { sendLeaderboard } from '../sendLeaderboard.js';

export function listWeekly(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');

  return sendLeaderboard(ctx.chat.id.toString());
}
