import type { LanguageModel, UserModel } from '../repos/UserModel.ts';

import { secondsToHours } from '../../utils/date.ts';
import { formatOrdinals } from '../../utils/ordinal.ts';
import { sortLanguagesByUsage } from '../repos/UserModel.ts';

const medals = ['🥇', '🥈', '🥉'];

export class User {
  avatar: string;
  diff: number;
  id: string;
  languages: LanguageModel[];
  lastDailyAverage: number;
  lastRank: number;
  lastTotalSeconds: number;
  name: string;
  telegramUsername?: string;
  username: string | null;

  get publicName() {
    return `${this.name} | ${this.username ?? 'N/A'}`;
  }

  private constructor(user: UserModel) {
    this.id = user.id;
    this.name = user.name;
    this.avatar = user.avatar;
    this.username = user.username;
    this.languages = sortLanguagesByUsage(user.languages ?? []);
    this.lastTotalSeconds = user.lastTotalSeconds ?? 0;
    this.lastDailyAverage = user.lastDailyAverage ?? 0;
    this.lastRank = user.lastRank;
    this.telegramUsername = user.telegramUsername;
    this.diff = user.diff ?? 0;
  }

  public static fromModel(user: UserModel): User {
    return new User(user);
  }

  public dumpInfo() {
    const name = this.telegramUsername ? `@${this.telegramUsername}` : '';
    return `<code>${this.id}</code>\n${this.publicName} ${name}`;
  }

  public getRankCaption(rank: number) {
    const medal = medals[rank] ?? formatOrdinals(rank + 1);
    const name = this.telegramUsername ? `@${this.telegramUsername}` : this.name;

    const hours = secondsToHours(this.lastTotalSeconds);
    return `${medal} <b>${name}</b>: <i>~${hours}hrs</i>`;
  }
}
