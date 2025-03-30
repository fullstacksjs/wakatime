import type { Axios } from 'axios';

import axios from 'axios';

import type { Container } from '../../config/initContainer.js';
import type { ReportModel } from '../repos/ReportModel.js';

import { Leaderboard } from '../models/Leaderboard.js';
import { Report } from '../models/Report.js';

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
    this.client = axios.create({ baseURL: this.config.apiEndpoint });
  }

  async getLeaderboard(): Promise<Leaderboard> {
    const { data } = await this.client.get('/day', { params: { size: 10 } });

    if (!isReportModel(data)) throw Error(`Invalid data:\n${JSON.stringify(data)}`);

    const report = Report.fromModel(data);
    const leaderboard = Leaderboard.fromReport(report);

    return leaderboard;
  }

  async setUsername(id: string, username: string) {
    return this.client.put('/user', { id, username });
  }
}
