import { WakatimeContext } from '../Context.js';

export const listWeekly = async (ctx: WakatimeContext) => {
  const users = await ctx.db.getTopUsers(3);
  try {
    const image = await ctx.getLeaderboardImage();
    return ctx.replyWithPhoto(
      { source: image as Buffer },
      { caption: ctx.messages.getReportTitle(users), parse_mode: 'HTML' },
    );
  } catch (error) {
    console.log(error);
    return ctx.reply('Oops!');
  }
};
