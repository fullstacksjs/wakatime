import { getWeekOfYear } from 'src/utils/date';
import dedent from 'ts-dedent';

import { Report, ReportModel } from './Report';
import { User, UserModel } from './User';

interface UserReport {
  report: ReportModel;
  user: UserModel;
}

export class LeaderboardModel {
  public userReports: UserReport[];

  public getReports(): ReportModel[] {
    return this.userReports.map(({ report }) => report);
  }

  public static fromDto(dtos: WakatimeDto[]): LeaderboardModel {
    return new LeaderboardModel(
      dtos.map(dto => ({
        report: ReportModel.fromDto(dto),
        user: UserModel.fromDto(dto),
      })),
    );
  }

  public static fromPersistance(values: { users: User[]; reports: Report[] }): LeaderboardModel {
    return new LeaderboardModel(
      values.reports.map(report => ({
        report: ReportModel.fromPersistance(report),
        user: UserModel.fromPersistance(values.users.find(u => report.userId === u.id)!),
      })),
    );
  }

  public getCaption() {
    const year = new Date().getFullYear();
    const week = getWeekOfYear(new Date());

    return dedent`
      <b>Wakatime Report</b>
      <i>${year} - Week ${week} </i>
      ${this.userReports.map(({ user }, rank) => user.getRankCaption(rank)).join('\n')}

      #wakatime_report

      @fullstacks
    `;
  }

  private constructor(values: UserReport[]) {
    this.userReports = values;
  }
}
