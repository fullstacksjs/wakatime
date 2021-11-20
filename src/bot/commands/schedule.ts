import { WakatimeContext } from '../Context.js';

export const schedule = async (ctx: WakatimeContext) => {
  if (ctx.schedule == null) return ctx.reply(ctx.messages.badSchedulePattern);
  if (!ctx.isGroup()) return ctx.reply(ctx.messages.notAGroup);
  const groupId = String(ctx.chat!.id);
  await ctx.scheduleDb.addSchedule(groupId, ctx.schedule);
  ctx.scheduleService.addOrUpdateOne(groupId, ctx.schedule);
  return ctx.reply(ctx.messages.scheduleSaved);
};
