/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Express } from 'express';
import express from 'express';

import type { Container } from '../config/initContainer.js';
import { getReport } from './getReport.js';

export class Api {
  private config: Config;
  private app: Express;

  constructor(opts: Container) {
    this.config = opts.config;

    this.app = express();
    this.app.use(express.json());

    this.app.get('/api/day', getReport);
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
