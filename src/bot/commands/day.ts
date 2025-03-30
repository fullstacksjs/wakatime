import dedent from 'dedent';

import type { WakatimeContext } from '../Context.ts';

import { container } from '../../config/container.ts';

const cache = new Map<string, Buffer>();

export async function day(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');
  const api = container.cradle.api;
  const leaderboardService = container.cradle.leaderboardService;

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

  if (cache.size > 2) {
    cache.keys().forEach(key => {
      if (key !== title) cache.delete(key);
    });
  }

  const image = cache.get(title)!;

  return ctx.sendLeaderboard(image, title);
}
