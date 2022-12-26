import type { UserModel } from './UserModel';

export interface UsageModel {
  rank: number;
  dailyAverage: number;
  totalSeconds: number;
  userId: string;
  user?: UserModel;
}

export const toUsageModel = (dto: WakatimeDto): UsageModel => {
  return {
    rank: dto.rank,
    dailyAverage: dto.running_total.daily_average,
    totalSeconds: dto.running_total.total_seconds,
    userId: dto.user.id,
  };
};
