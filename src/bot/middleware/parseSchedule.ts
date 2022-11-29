import { toInteger } from '@fullstacksjs/toolbox';
import type { Middleware } from 'grammy';

import { toEnglishDay } from '../../utils/date.js';
import type { WakatimeContext } from '../Context.js';

export const parseSchedule: Middleware<WakatimeContext> = async (ctx, next) => {
  const [day, hrs, mins] = (ctx.match as RegExpMatchArray).slice(1, 4).map(toInteger) as Schedule;
  ctx.schedule = [toEnglishDay(day) as Day, hrs, mins];
  await next();
};
