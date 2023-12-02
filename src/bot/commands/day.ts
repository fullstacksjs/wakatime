import { isString } from '@fullstacksjs/toolbox';

import { container } from '../../config/container.js';
import type { WakatimeContext } from '../Context.js';
import { dedent } from 'ts-dedent';

const cache = new Map<string, Buffer>();

export async function day(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');
  const api = container.cradle.api;
  const leaderboardService = container.cradle.leaderboardService;

  try {
    const leaderboard = await api.getLeaderboard();
    const title = leaderboard.getDayCaption();

    await ctx.report(
      leaderboard.report.usages.reduce(
        (acc, u) =>
          dedent`
          ${acc}
          ${u.rank}:
            ID: <code>${u.user.id}</code>
            NAME: ${u.user.name}
            UNAME: ${u.user.username ?? ''}
          `,
        '',
      ),
    );

    if (!cache.has(title)) {
      const screenshot = await leaderboardService.getScreenshot();
      cache.set(title, screenshot);
    }

    const image = cache.get(title)!;

    return await ctx.sendLeaderboard(image, title);
  } catch (e) {
    if (e instanceof Error) return ctx.reportError(e.message);
    if (isString(e)) return ctx.reportError(e);

    return ctx.reportError('Unknown Error');
  }
}
