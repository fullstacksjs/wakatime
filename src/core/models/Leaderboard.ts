import dedent from 'dedent';

import type { ReportModel } from '../repos/ReportModel.ts';

import { getDayOfYear, getWeekOfYear } from '../../utils/date.ts';
import { Report } from './Report.ts';

export class Leaderboard {
  public report: Report;

  public get dayTitle(): string {
    const year = new Date().getFullYear();
    const day = getDayOfYear(new Date());
    return `${year} - Day ${day}`;
  }

  public get weekTitle(): string {
    const year = new Date().getFullYear();
    const week = getWeekOfYear(new Date());
    return `${year} - Week ${week}`;
  }

  private footer = dedent`

      #wakatime_report

      👉 https://fullstacksjs.com/en/wakatime
  `;

  private constructor(report: Report) {
    this.report = report;
  }

  public static fromModel(report: ReportModel): Leaderboard {
    return new Leaderboard(Report.fromModel(report));
  }

  public static fromReport(report: Report): Leaderboard {
    return new Leaderboard(report);
  }

  public getDayCaption() {
    return dedent`
      <b>Wakatime Report</b>
      <i>${this.dayTitle}</i>
      ${this.report.usages.map(({ user }, rank) => user.getRankCaption(rank)).join('\n')}
      ${this.footer}
    `;
  }

  public getWeekCaption() {
    return dedent`
      <b>Wakatime Report</b>
      <i>${this.weekTitle}</i>
      ${this.report.usages.map(({ user }, rank) => user.getRankCaption(rank)).join('\n')}
      ${this.footer}
    `;
  }
}
