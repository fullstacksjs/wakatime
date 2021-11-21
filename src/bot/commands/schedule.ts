import { WakatimeContext } from '../Context.js';

export const schedule = async (ctx: WakatimeContext) => {
  if (ctx.schedule == null) return ctx.reply(ctx.messages.badSchedulePattern);
  if (!ctx.isGroup()) return ctx.reply(ctx.messages.notAGroup);
  const groupId = String(ctx.chat!.id);
  await ctx.groupScheduleService.upsertJob(groupId, ctx.schedule, ctx.sendWeekly);
  return ctx.reply(ctx.messages.scheduleSaved);
};
