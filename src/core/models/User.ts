import { secondsToHours } from '../../utils/date.js';

export interface User {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  lastTotalSeconds: number | null;
  lastDailyAverage: number | null;
  lastRank: number;
  diff: number;
  telegramUsername?: string;
}

const medals = ['🥇', '🥈', '🥉'];

export class UserModel implements User {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  lastTotalSeconds: number;
  lastDailyAverage: number;
  lastRank: number;
  diff: number;
  telegramUsername?: string;

  public getRankCaption(rank: number) {
    const medal = medals[rank];
    const name = this.telegramUsername ? `@${this.telegramUsername}` : this.name;

    const hours = secondsToHours(this.lastTotalSeconds);
    return `${medal} <b>${name}</b>: <i>~${hours}hrs</i>`;
  }

  public static fromPersistance(user: User): UserModel {
    return new UserModel(user);
  }

  public static fromDto(dto: WakatimeDto): UserModel {
    return new UserModel({
      id: dto.user.id,
      name: dto.user.display_name,
      avatar: dto.user.photo,
      username: dto.user.username,
      lastTotalSeconds: dto.running_total.total_seconds,
      lastDailyAverage: dto.running_total.daily_average,
      lastRank: dto.rank,
      diff: 0,
    });
  }

  private constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.avatar = user.avatar;
    this.username = user.username;
    this.lastTotalSeconds = user.lastTotalSeconds ?? 0;
    this.lastDailyAverage = user.lastDailyAverage ?? 0;
    this.lastRank = user.lastRank;
    this.telegramUsername = user.telegramUsername;
    this.diff = user.diff;
  }
}
