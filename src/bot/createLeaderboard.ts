import { getScreenshot } from '../utils/getScreenshot';
import { WakatimeRepo } from '../WakatimeRepo';
import { getReportCaption } from './getReportCaption';

export const createLeaderboard = async (
  config: Config,
  repo: WakatimeRepo,
): Promise<Leaderboard> => {
  const topUsers = await repo.getTopUsers(3);
  const image = await getScreenshot({
    url: config.webpageUrl,
    puppeteerExecutablePath: config.puppeteerExecutablePath,
    encoding: 'binary',
    type: 'png',
    width: 815,
    height: 700,
    deviceScaleFactor: 2,
    timeout: 2000,
  });
  return { caption: getReportCaption(topUsers), image };
};
