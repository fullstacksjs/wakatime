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
