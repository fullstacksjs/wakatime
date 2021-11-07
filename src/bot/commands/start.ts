import { WakatimeContext } from '../Context.js';

export const startCommand = (ctx: WakatimeContext) => {
  return ctx.reply(ctx.messages.welcome);
};
