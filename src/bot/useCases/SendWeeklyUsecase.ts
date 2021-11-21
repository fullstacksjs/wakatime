import { Api, InputFile } from 'grammy';

import { LeaderboardUseCase } from './LeaderboardUsecase';

export class SendWeeklyUsecase {
  constructor(private api: Api) {}

  async execuet(groupId: GroupId) {
    const leaderboard = await new LeaderboardUseCase().execute();
    const photo = new InputFile(leaderboard.image);
    return this.api.sendPhoto(groupId, photo, {
      caption: leaderboard.caption,
      parse_mode: 'HTML',
    });
  }
}
