import { getThisWeekId } from '../../utils/date.js';
import type { Report, ReportModel } from '../models/Report.js';
import { BaseRepo } from './BaseRepo.js';

interface WakatimeDb {
  weeks: Record<Week, Report[]>;
}

export class ReportRepo extends BaseRepo<WakatimeDb> {
  protected override initialState: WakatimeDb = { weeks: {} };

  constructor(opts: Container) {
    super(opts.config.leaderboardDbFilePath);
  }

  async saveReports(reports: ReportModel[]) {
    this.assertInitialized();

    const weekId = getThisWeekId(new Date());
    this.db.data!.weeks[weekId] = reports;
    await this.db.write();
  }

  async getTopReports(count: number): Promise<Report[] | undefined> {
    this.assertInitialized();

    await this.db.read();
    const weekId = getThisWeekId(new Date());
    return this.db.data!.weeks[weekId]?.slice(0, count);
  }
}
