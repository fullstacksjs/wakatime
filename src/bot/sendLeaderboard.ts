import { InputFile } from 'grammy';

import { container } from '../config/container.js';

const cache = new Map<string, Buffer>();

export async function sendLeaderboard(groupId: GroupId) {
  try {
    const leaderboard = await container.cradle.leaderboardService.getLeaderboard();

    console.log(leaderboard.title);

    if (!cache.has(leaderboard.title))
      cache.set(
        leaderboard.title,
        await container.cradle.puppeteerService.getScreenshot({
          url: container.cradle.config.webpageUrl,
          width: 815,
          height: 700,
          deviceScaleFactor: 2,
        }),
      );

    const image = cache.get(leaderboard.title)!;

    return container.cradle.api.sendPhoto(groupId, new InputFile(image), {
      caption: leaderboard.getCaption(),
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error(error);
    return container.cradle.api.sendMessage(groupId, 'Oops! try again');
  }
}
