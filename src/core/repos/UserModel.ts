export interface UserModel {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  lastTotalSeconds: number | null;
  lastDailyAverage: number | null;
  lastRank: number;
  diff?: number;
  telegramUsername?: string;
}

export const toUserModel = (dto: WakatimeDto): UserModel => {
  return {
    id: dto.user.id,
    name: dto.user.display_name,
    avatar: dto.user.photo,
    username: dto.user.username,
    lastTotalSeconds: dto.running_total.total_seconds,
    lastDailyAverage: dto.running_total.daily_average,
    lastRank: dto.rank,
  };
};
