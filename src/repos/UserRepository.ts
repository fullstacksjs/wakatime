import { isNull } from '@fullstacksjs/toolbox';

import { User, UserModel } from '../models/User';
import { BaseRepo } from './BaseRepo';

interface UserDb {
  users: { [key: string]: User };
}

export class LeaderboardRepo extends BaseRepo<UserDb> {
  async save(user: UserModel) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    this.db!.data!.users[user.id] = {
      ...user,
      diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
    };

    await this.db.write();
  }

  async get(id: string) {
    if (isNull(this.db)) throw Error('You need to init db before use');
    await this.db.read();
    return this.db.data?.users?.[id];
  }
}
