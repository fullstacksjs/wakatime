import type { Axios } from 'axios';

import axios from 'axios';

import type { Container } from '../../config/initContainer.ts';
import type { ReportModel } from '../repos/ReportModel.ts';

import { Leaderboard } from '../models/Leaderboard.ts';
import { Report } from '../models/Report.ts';
import { User } from '../models/User.ts';

function isReportModel(data: any): data is ReportModel {
  return 'usages' in data;
}

interface UserFilter {
  size: number;
  type?: 'WithoutUsername' | 'WithUsername';
}

export class ApiSDK {
  private config: Config;

  constructor(
    opts: Container,
    private client: Axios,
  ) {
    this.config = opts.config;
    this.client = axios.create({ baseURL: this.config.bot.api });
  }

  async getLeaderboard(): Promise<Leaderboard> {
    const { data } = await this.client.get('/day', { params: { size: 10 } });

    if (!isReportModel(data)) throw Error(`Invalid data:\n${JSON.stringify(data)}`);

    const report = Report.fromModel(data);
    const leaderboard = Leaderboard.fromReport(report);

    return leaderboard;
  }

  async getUserList(filter: UserFilter) {
    const { data } = await this.client.get('/users', { params: filter });

    if (!Array.isArray(data)) throw Error(`Invalid data:\n${JSON.stringify(data)}`);

    return data.map(user => User.fromModel(user));
  }

  async setUsername(id: string, username: string) {
    return this.client.put(
      '/users',
      { id, username },
      {
        headers: {
          Authorization: `Bearer ${this.config.api.token}`,
        },
      },
    );
  }
}
