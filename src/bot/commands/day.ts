import { Env } from '@fullstacksjs/toolbox';

import axios from 'axios';
import { getScreenshot } from '../../core/Services/getScreenshot.js';
import type { WakatimeContext } from '../Context.js';
import { Leaderboard } from '../../core/models/Leaderboard.js';
import type { Report } from '../../core/models/Report.js';

const cache = new Map<string, Buffer>();

export async function day(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');

  const reports: Report = (await axios.get('https://wakatime.fullstacksjs.com/api/day?size=10'))
    .data;
  const leaderboard = Leaderboard.fromReport(reports);
  const screenshot = await getScreenshot('day');
  const title = leaderboard.getDayCaption();

  if (Env.isDev) console.log(leaderboard.report.usages);

  if (!cache.has(title)) cache.set(title, screenshot);
  const image = cache.get(title)!;

  return ctx.sendLeaderboard(image, title);
}
