import { isNull } from '@fullstacksjs/toolbox';

import type { User, UserModel } from '../models/User.js';
import { BaseRepo } from './BaseRepo.js';

interface UserDb {
  users: { [key: string]: User };
}

export class UserRepo extends BaseRepo<UserDb> {
  protected override initialState: UserDb | undefined = { users: {} };

  constructor(opts: Container) {
    super(opts.config.userDbFilePath);
  }

  async save(user: UserModel) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    this.db!.data!.users[user.id] = {
      ...user,
      diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
    };

    await this.db.write();
  }

  saveUsers(users: UserModel[]) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    users.forEach(user => {
      this.db!.data!.users[user.id] = {
        ...user,
        diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
      };
    });

    return this.db?.write();
  }

  async get(id: string) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();
    return this.db.data?.users?.[id];
  }
}
