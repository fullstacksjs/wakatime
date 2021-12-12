import { dedent } from 'ts-dedent';

import { getWeekOfYear } from '../../utils/date.js';
import { Report, ReportModel } from './Report.js';
import { User, UserModel } from './User.js';

interface UserReport {
  report: ReportModel;
  user: UserModel;
}

export class LeaderboardModel {
  public userReports: UserReport[];

  public get title(): string {
    const year = new Date().getFullYear();
    const week = getWeekOfYear(new Date());
    return `${year} - Week ${week}`;
  }

  public getReports(): ReportModel[] {
    return this.userReports.map(({ report }) => report);
  }

  public getUsers(): UserModel[] {
    return this.userReports.map(({ user }) => user);
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
    return dedent`
      <b>Wakatime Report</b>
      <i>${this.title}</i>
      ${this.userReports.map(({ user }, rank) => user.getRankCaption(rank)).join('\n')}

      #wakatime_report

      @fullstacks
    `;
  }

  private constructor(values: UserReport[]) {
    this.userReports = values;
  }
}
