import type { ReportModel } from '../repos/ReportModel.js';
import { Usage } from './Usage.js';

export class Report {
  public date: Date;
  public usages: Usage[];

  public static fromModel(report: ReportModel): Report {
    return new Report({
      date: report.date,
      usages: report.usages.map(Usage.fromModel),
    });
  }

  public toModel(): ReportModel {
    return {
      date: this.date,
      usages: this.usages.map(x => x.toModel()),
    };
  }

  private constructor(report: { date: Date; usages: Usage[] }) {
    this.usages = report.usages;
    this.date = report.date;
  }
}
