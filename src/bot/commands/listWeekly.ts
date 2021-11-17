import { InputFile } from 'grammy';

import { WakatimeContext } from '../Context.js';

export const listWeekly = async (ctx: WakatimeContext) => {
  const users = await ctx.wakatimeDb.getTopUsers(3);
  try {
    const image = await ctx.getLeaderboardImage();
    const file = new InputFile(image);
    return ctx.replyWithPhoto(file, {
      caption: ctx.messages.getReportTitle(users),
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.log(error);
    return ctx.reply('Oops!');
  }
};
