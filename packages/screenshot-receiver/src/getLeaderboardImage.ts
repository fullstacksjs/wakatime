import { getTopUsers } from '../../api/index.js';
import { getConfig } from './getConfig.js';
import { Encoding, getScreenshot, ImageType } from './getScreenshot.js';
import { getUrlWithParams } from './url.js';

const config = getConfig();

export function getLeaderboardImage({ encoding, type }: { type: ImageType; encoding: Encoding }) {
  try {
    const topUsers = getTopUsers(3);
    const url = getUrlWithParams(config.webpageUrl, [['users', topUsers]]);
    return getScreenshot({
      url,
      puppeteerExecutablePath: config.puppeteerExecutablePath,
      type,
      encoding,
    });
  } catch (error) {
    console.error(error);
  }
}
