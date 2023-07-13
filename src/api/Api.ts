/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Express } from 'express';
import express from 'express';

import { getReport } from './getReport.js';
import { renderDayLeaderboard, renderWeekLeaderboard } from './renderLeaderboard.js';
import type { Container } from '../config/initContainer.js';
import { toAbsolutePath } from '../utils/path.js';

export class Api {
  private config: Config;
  private app: Express;

  constructor(opts: Container) {
    this.config = opts.config;

    this.app = express();
    const viewPath = toAbsolutePath('/api/web');
    this.app.set('view engine', 'ejs');
    this.app.set('views', viewPath);

    this.app.use(express.json());
    this.app.use(express.static(viewPath));

    this.app.get('/api/day', getReport);
    this.app.get('/week', renderWeekLeaderboard);
    this.app.get('/day', renderDayLeaderboard);
    this.app.get('/bail', (_, res) => res.status(200).end(''));
  }

  public start() {
    return new Promise(resolve => {
      this.app.listen(this.config.apiPort, () => {
        console.log(`listening on port ${this.config.apiPort}`);
        resolve(this.config);
      });
    });
  }
}
