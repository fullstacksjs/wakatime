import { toHumanHM } from '../../utils/date.js';
import { formatOrdinals } from '../../utils/ordinal.js';

export interface Report {
  rank: number;
  dailyAverage: number;
  totalSeconds: number;
  userId: string;
}

export class ReportModel implements Report {
  rank: number;
  dailyAverage: number;
  totalSeconds: number;
  userId: string;

  get ordinalRank() {
    return formatOrdinals(this.rank);
  }

  get humanReadableDailyAverage() {
    return toHumanHM(this.dailyAverage);
  }

  get humanReadableTotalSeconds() {
    return toHumanHM(this.totalSeconds);
  }

  public static fromPersistance(report: Report): ReportModel {
    return new ReportModel(report);
  }

  public static fromDto(dto: WakatimeDto): ReportModel {
    return new ReportModel({
      rank: dto.rank,
      dailyAverage: dto.running_total.daily_average,
      totalSeconds: dto.running_total.total_seconds,
      userId: dto.user.id,
    });
  }

  private constructor(report: Report) {
    this.rank = report.rank;
    this.dailyAverage = report.dailyAverage;
    this.totalSeconds = report.totalSeconds;
    this.userId = report.userId;
  }
}
