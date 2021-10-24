import { WakatimeContext } from '../Context';
import { getHours } from '../utils';

const medals = ['🥇', '🥈', '🥉'];

export const listWeekly = async (ctx: WakatimeContext) => {
  // const {
  //   data: { data },
  // } = await api.get<WakaTimeAPI>(`/users/current/leaderboards/${leaderboardsId}`);
  // const bestCoder = data.slice(0, 3);
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
};
