import { Middleware } from 'grammy';

import { WakatimeContext } from '../Context';

export const parseSchedule: Middleware<WakatimeContext> = async (ctx, next) => {
  const [, day, time] = ctx.match as string;
  ctx.schedule = `${day} ${time}` as Schedule;
  await next();
};
