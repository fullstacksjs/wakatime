import { secondsToHours } from '../../utils/date.js';
import type { UserModel } from '../repos/UserModel.js';

const medals = ['🥇', '🥈', '🥉'];

export class User {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  lastTotalSeconds: number;
  lastDailyAverage: number;
  lastRank: number;
  diff: number;
  telegramUsername?: string;

  get publicName() {
    return `${this.name} | ${this.username ?? 'N/A'}`;
  }

  public getRankCaption(rank: number) {
    const medal = medals[rank];
    const name = this.telegramUsername ? `@${this.telegramUsername}` : this.name;

    const hours = secondsToHours(this.lastTotalSeconds);
    return `${medal} <b>${name}</b>: <i>~${hours}hrs</i>`;
  }

  public dumpInfo() {
    const name = this.telegramUsername ? `@${this.telegramUsername}` : '';
    return `<code>${this.id}</code>\n${this.publicName} ${name}`;
  }

  public static fromModel(user: UserModel): User {
    return new User(user);
  }

  private constructor(user: UserModel) {
    this.id = user.id;
    this.name = user.name;
    this.avatar = user.avatar;
    this.username = user.username;
    this.lastTotalSeconds = user.lastTotalSeconds ?? 0;
    this.lastDailyAverage = user.lastDailyAverage ?? 0;
    this.lastRank = user.lastRank;
    this.telegramUsername = user.telegramUsername;
    this.diff = user.diff ?? 0;
  }
}
