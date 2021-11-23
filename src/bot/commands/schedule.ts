import { container } from '../../config/container.js';
import { WakatimeContext } from '../Context.js';
import { sendLeaderboard } from '../sendLeaderboard.js';

export const schedule = async (ctx: WakatimeContext) => {
  if (ctx.schedule == null) return ctx.reply(ctx.messages.badSchedulePattern);
  if (!ctx.isGroup()) return ctx.reply(ctx.messages.notAGroup);
  const groupId = String(ctx.chat!.id);

  await container.cradle.groupScheduleService.upsertJob(groupId, ctx.schedule, sendLeaderboard);
  return ctx.reply(ctx.messages.scheduleSaved);
};
