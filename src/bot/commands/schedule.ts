import { WakatimeContext } from '../Context.js';

export const schedule = async (ctx: WakatimeContext) => {
  if (ctx.schedule == null) return ctx.reply(ctx.messages.badSchedulePattern);
  if (!ctx.isGroup()) return ctx.reply(ctx.messages.notAGroup);
  await ctx.scheduleDb.addSchedule(String(ctx.chat!.id), ctx.schedule);
  return ctx.reply(ctx.messages.scheduleSaved);
};
