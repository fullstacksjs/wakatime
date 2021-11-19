import { toInteger } from '@fullstacksjs/toolbox';
import { Middleware } from 'grammy';

import { WakatimeContext } from '../Context';

export const parseSchedule: Middleware<WakatimeContext> = async (ctx, next) => {
  const [, day, time] = ctx.match as [string, string, string];
  const [hrs, mins] = time.split(':').map(toInteger) as [number, number];
  ctx.schedule = [toInteger(day) as Day, hrs, mins];
  await next();
};
