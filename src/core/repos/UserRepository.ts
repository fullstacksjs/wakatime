import type { User } from '../models/User.js';
import { UserModel } from '../models/User.js';
import { BaseRepo } from './BaseRepo.js';

interface UserDb {
  users: Record<string, User>;
}

export class UserRepo extends BaseRepo<UserDb> {
  protected override initialState: UserDb | undefined = { users: {} };

  constructor(opts: Container) {
    super(opts.config.userDbFilePath);
  }

  async save(user: UserModel) {
    this.assertInitialized();

    this.db!.data!.users[user.id] = {
      ...user,
      diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
    };

    await this.db.write();
  }

  public async setTelegramUsername(id: string, username: string) {
    await this.db.read();

    if (this.db.data?.users[id] != null) {
      this.db.data.users[id]!.telegramUsername = username;
      await this.db.write();
    }
  }

  saveUsers(users: UserModel[]) {
    this.assertInitialized();

    users.forEach(user => {
      this.db!.data!.users[user.id] = {
        ...user,
        diff: (this.db!.data!.users[user.id]?.lastRank ?? user.lastRank) - user.lastRank,
      };
    });

    return this.db?.write();
  }

  async get(id: string) {
    this.assertInitialized();

    await this.db.read();
    return this.db.data?.users?.[id];
  }

  async list(): Promise<UserModel[]> {
    this.assertInitialized();

    await this.db.read();
    return Object.values(this.db.data?.users ?? {}).map(UserModel.fromPersistance);
  }
}
