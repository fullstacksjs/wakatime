import type { Container } from '../../config/initContainer.ts';
import type { ReportModel } from '../repos/ReportModel.ts';

import { Leaderboard } from '../models/Leaderboard.ts';
import { Report } from '../models/Report.ts';
import { User } from '../models/User.ts';
import { HttpClient } from './HttpClient.ts';

function isReportModel(data: any): data is ReportModel {
  return 'usages' in data;
}

interface UserFilter {
  size: number;
  type?: 'WithoutUsername' | 'WithUsername';
}

export class ApiSDK {
  private config: Config;
  private httpClient: HttpClient;

  constructor(opts: Container) {
    this.config = opts.config;
    this.httpClient = new HttpClient(this.config.bot.api);
  }

  async getLeaderboard(): Promise<Leaderboard> {
    const data = await this.httpClient.get('/day?size=10');
    if (!isReportModel(data)) throw Error(`Invalid data:\n${JSON.stringify(data)}`);
    const report = Report.fromModel(data);
    const leaderboard = Leaderboard.fromReport(report);
    return leaderboard;
  }

  async getUserList(filter: UserFilter) {
    const params = new URLSearchParams(
      Object.entries(filter)
        .filter(([_, v]) => v != null)
        .map(([k, v]) => [k, String(v)]),
    );
    const data = await this.httpClient.get(`/users?${params.toString()}`);

    if (!Array.isArray(data)) throw Error(`Invalid data:\n${JSON.stringify(data)}`);
    return data.map(user => User.fromModel(user));
  }

  async setUsername(id: string, username: string) {
    return this.httpClient.put('/users', {
      body: { id, username },
      headers: { Authorization: `Bearer ${this.config.api.token}` },
    });
  }
}
