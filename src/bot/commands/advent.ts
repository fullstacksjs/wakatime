import { isString } from '@fullstacksjs/toolbox';

import type { WakatimeContext } from '../Context.js';
import { dedent } from 'ts-dedent';
import { formatOrdinals } from '../../utils/ordinal.js';
import { container } from '../../config/container.js';

const medals = ['🥇', '🥈', '🥉'];

export async function adventCommand(ctx: WakatimeContext) {
  if (!ctx.chat) return ctx.reply('Why are you gay?');
  const advent = container.cradle.adventService;

  try {
    const screenshot = await advent.getScreenshot();
    const leaderboard = await advent.getLeaderboard();

    const day = new Date().getDate();
    const title = dedent`
      <b>Advent of Code 2023</b>: Day ${day}

      ${leaderboard
        .filter(u => u.score > 0)
        .map(
          (u, rank) =>
            dedent`┌ <b>${getRank(rank)}</b> ${u.name}
              └ <code>${u.score}pt</code> ▸ 🔸x${u.stars.gold
                .toString()
                .padEnd(2)}🔹x${u.stars.silver.toString().padEnd(2)}
          `,
        )
        .join('\n')}

        👉 fullstacksjs.com/en/advent/board
    `;
    return await ctx.sendLeaderboard(screenshot, title);
  } catch (e) {
    if (e instanceof Error) return ctx.reportError(e.message);
    if (isString(e)) return ctx.reportError(e);

    return ctx.reportError('Unknown Error');
  }
}

function getRank(rank: number) {
  return medals[rank] ?? formatOrdinals(rank + 1);
}
