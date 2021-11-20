import { Api, InputFile } from 'grammy';

import { WakatimeRepo } from '../../WakatimeRepo';
import { createLeaderboard } from './createLeaderboard';

export const createSendWeekly =
  (config: Config, repo: WakatimeRepo, api: Api) => async (groupId: GroupId) => {
    const leaderboard = await createLeaderboard(config, repo);
    const photo = new InputFile(leaderboard.image);
    return api.sendPhoto(groupId, photo, { caption: leaderboard.caption });
  };
