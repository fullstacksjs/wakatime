import fs from 'fs/promises';
import path from 'path';

import { getTopUsers, initDb, saveUsers } from './db.js';
import { getConfig } from './getConfig.js';
import { Encoding, getScreenshot, ImageType } from './getScreenshot.js';
import { getUsers } from './getWakatimeUsers.js';
import { getUrlWithParams } from './url.js';

const config = getConfig();

export async function getLeaderboardImage({
  encoding,
  type,
}: {
  type: ImageType;
  encoding: Encoding;
}) {
  try {
    await fs.mkdir(path.dirname(config.dbFilePath), { recursive: true });
    const db = await initDb(config.dbFilePath);
    const users = await getUsers();
    await saveUsers(db, users);
    const topUsers = await getTopUsers(db, users, 3);
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
