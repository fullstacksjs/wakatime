import { isNull } from '@fullstacksjs/toolbox';

import { getWeekOfYear } from '../../utils/date.js';
import { Report, ReportModel } from '../models/Report.js';
import { BaseRepo } from './BaseRepo.js';

interface WakatimeDb {
  weeks: { [key: Week]: Report[] };
}

export class ReportRepo extends BaseRepo<WakatimeDb> {
  protected override initialState: WakatimeDb | undefined = { weeks: {} };

  constructor(opts: Container) {
    super(opts.config.leaderboardDbFilePath);
  }

  async saveReports(reports: ReportModel[]) {
    if (isNull(this.db)) throw Error('You need to init db before use');

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());

    this.db.data!.weeks[`${currentYear}:${currentWeek}`] = reports;

    await this.db.write();
  }

  async getTopReports(count: number): Promise<Report[] | undefined> {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();

    const currentYear = new Date().getFullYear();
    const currentWeek = getWeekOfYear(new Date());
    return this.db.data!.weeks[`${currentYear}:${currentWeek}`]?.slice(0, count);
  }
}
