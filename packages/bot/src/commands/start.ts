import { WakatimeContext } from '../Context';

export const startCommand = (ctx: WakatimeContext) => {
  return ctx.reply(ctx.messages.welcome);
};
