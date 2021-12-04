import { InputFile } from 'grammy';

import { container } from '../config/container.js';

export async function sendLeaderboard(groupId: GroupId) {
  try {
    const leaderboard = await container.cradle.leaderboardService.getLeaderboard();
    const image = await container.cradle.puppeteerService.getScreenshot({
      url: container.cradle.config.webpageUrl,
      puppeteerExecutablePath: container.cradle.config.puppeteerExecutablePath,
      width: 815,
      height: 700,
      deviceScaleFactor: 2,
    });

    return container.cradle.api.sendPhoto(groupId, new InputFile(image), {
      caption: leaderboard.getCaption(),
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.log(error);
    return container.cradle.api.sendMessage(groupId, 'Oops! try again');
  }
}
