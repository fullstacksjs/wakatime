import type { WakatimeContext } from '../Context.ts';

export const helpCommand = (ctx: WakatimeContext) => {
  return ctx.reply(ctx.messages.help);
};
