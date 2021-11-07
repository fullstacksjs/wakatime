import { WakatimeContext } from '../Context.js';

export const listWeekly = async (ctx: WakatimeContext) => {
  const users = await ctx.db.getTopUsers(3);
  try {
    // const header = `<b>Wakatime Report</b>\n <i>${new Date().getFullYear()} - Week 40 </i>\n`;
    // const body = bestCoder
    //   .map(
    //     (item, idx: number) =>
    //       `${medals[idx]} <b>${item.user.full_name}</b>: <i>~${getHours(
    //         item.running_total.total_seconds,
    //       )}hrs</i>\n`,
    //   )
    //   .join('');
    // const footer = `\n#wakatime_report\n\n@fullstacks`;
    // ctx.reply(`${header + body + footer}`, {
    //   parse_mode: 'HTML',
    // });
    const image = await ctx.getLeaderboardImage(users);
    return ctx.replyWithPhoto({ source: image as Buffer }, { caption: 'Hello' });
  } catch {
    return ctx.reply('Oops!');
  }
};
