import { dedent } from 'ts-dedent';

import { getDayOfYear, getWeekOfYear } from '../../utils/date.js';
import type { ReportModel } from '../repos/ReportModel.js';
import { Report } from './Report.js';

export class Leaderboard {
  public report: Report;

  public get weekTitle(): string {
    const year = new Date().getFullYear();
    const week = getWeekOfYear(new Date());
    return `${year} - Week ${week}`;
  }

  public get dayTitle(): string {
    const year = new Date().getFullYear();
    const day = getDayOfYear(new Date());
    return `${year} - Day ${day}`;
  }

  public static fromReport(report: Report): Leaderboard {
    return new Leaderboard(report);
  }

  public static fromModel(report: ReportModel): Leaderboard {
    return new Leaderboard(Report.fromModel(report));
  }

  private footer = dedent`

      #wakatime_report

      👉 fullstacksjs.com
  `;

  public getDayCaption() {
    return dedent`
      <b>Wakatime Report</b>
      <i>${this.dayTitle}</i>
      ${this.report.usages.map(({ user }, rank) => user?.getRankCaption(rank)).join('\n')}
      ${this.footer}
    `;
  }

  public getWeekCaption() {
    return dedent`
      <b>Wakatime Report</b>
      <i>${this.weekTitle}</i>
      ${this.report.usages.map(({ user }, rank) => user?.getRankCaption(rank)).join('\n')}
      ${this.footer}
    `;
  }

  private constructor(report: Report) {
    this.report = report;
  }
}
