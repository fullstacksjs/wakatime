import { isNull } from '@fullstacksjs/toolbox';

import type { UsageModel } from '../repos/UsageModel.ts';

import { User } from './User.ts';

export class Usage {
  dailyAverage: number;
  rank: number;
  totalSeconds: number;
  user: User;

  private constructor(
    report: {
      rank: number;
      dailyAverage: number;
      totalSeconds: number;
      userId: string;
    },
    user: User,
  ) {
    this.rank = report.rank;
    this.dailyAverage = report.dailyAverage;
    this.totalSeconds = report.totalSeconds;
    this.user = user;
  }

  public static fromModel(usage: UsageModel): Usage {
    if (isNull(usage.user)) throw Error(`User ${usage.userId} does not exist for`);
    return new Usage(usage, User.fromModel(usage.user));
  }

  public toModel(): UsageModel {
    return {
      dailyAverage: this.dailyAverage,
      rank: this.rank,
      totalSeconds: this.totalSeconds,
      userId: this.user.id,
    };
  }
}
