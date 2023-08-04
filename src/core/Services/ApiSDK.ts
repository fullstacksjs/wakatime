import { Axios } from 'axios';

import type { Container } from '../../config/initContainer.js';
import { Leaderboard } from '../models/Leaderboard.js';
import { Report } from '../models/Report.js';
import type { ReportModel } from '../repos/ReportModel.js';

function isReportModel(data: any): data is ReportModel {
  return 'usages' in data;
}

export class ApiSDK {
  private config: Config;

  constructor(
    opts: Container,
    private client: Axios,
  ) {
    this.config = opts.config;
    this.client = new Axios({ baseURL: this.config.apiEndpoint });
  }

  async getLeaderboard(): Promise<Leaderboard> {
    const { data: res } = await this.client.get('/day', {
      params: { size: 10 },
    });

    const data = JSON.parse(res);

    if (!isReportModel(data)) throw Error(`Invalid data:\n${JSON.stringify(data)}`);

    const report = Report.fromModel(data);
    const leaderboard = Leaderboard.fromReport(report);

    return leaderboard;
  }

  async setUsername(id: string, username: string) {
    return this.client.put('/user', { id, username });
  }
}
