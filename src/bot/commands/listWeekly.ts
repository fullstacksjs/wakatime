import { InputFile } from 'grammy';

import { WakatimeContext } from '../Context.js';

export const listWeekly = async (ctx: WakatimeContext) => {
  try {
    const leaderboard = await ctx.getLeaderboard();
    const file = new InputFile(leaderboard.image);
    return ctx.replyWithPhoto(file, {
      caption: leaderboard.caption,
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.log(error);
    return ctx.reply('Oops!');
  }
};
