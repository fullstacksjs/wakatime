import type { WakatimeContext } from '../Context.ts';

export const startCommand = (ctx: WakatimeContext) => {
  return ctx.reply(ctx.messages.welcome);
};
