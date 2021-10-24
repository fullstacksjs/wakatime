import { WakatimeContext } from '../Context';

export const helpCommand = (ctx: WakatimeContext) => {
  return ctx.reply(ctx.messages.help);
};
