import type { Middleware } from 'grammy';

import type { WakatimeContext } from '../Context';

export const authMiddleware: Middleware<WakatimeContext> = (ctx, next) => {
  if (ctx.isAdmin()) return next();
  return ctx.replyToMessage('Why are you gay?');
};
