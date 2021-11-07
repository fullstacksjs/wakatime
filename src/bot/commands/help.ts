import { WakatimeContext } from '../Context.js';

export const helpCommand = (ctx: WakatimeContext) => {
  return ctx.reply(ctx.messages.help);
};
