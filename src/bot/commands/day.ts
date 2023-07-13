import { Env } from '@fullstacksjs/toolbox';

import axios from 'axios';
import { getScreenshot } from '../../core/Services/getScreenshot.js';
import { Leaderboard } from '../../core/models/Leaderboard.js';
import { Report } from '../../core/models/Report.js';
import type { ReportModel } from '../../core/repos/ReportModel.js';
import type { WakatimeContext } from '../Context.js';

const cache = new Map<string, Buffer>();

export async function day(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');

  // FIXME: Refactor
  const reportModel: ReportModel = (
    await axios.get('https://wakatime.fullstacksjs.com/api/day?size=10')
  ).data;

  const report: Report = Report.fromModel(reportModel);
  const leaderboard = Leaderboard.fromReport(report);
  const screenshot = await getScreenshot();
  const title = leaderboard.getDayCaption();
  console.log(title);

  if (Env.isDev) console.log(leaderboard.report.usages);

  if (!cache.has(title)) cache.set(title, screenshot);
  const image = cache.get(title)!;

  return ctx.sendLeaderboard(image, title);
}
