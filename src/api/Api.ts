/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Express } from 'express';
import express from 'express';

import type { Container } from '../config/initContainer.js';
import { getReport } from './getReport.js';
import { setUsername } from './setUsername.js';

export class Api {
  private config: Config;
  private app: Express;

  constructor(opts: Container) {
    this.config = opts.config;

    this.app = express();
    this.app.use(express.json());

    this.app.get('/api/day', getReport);
    this.app.put('/api/user', setUsername);
  }

  public start() {
    return new Promise(resolve => {
      this.app.listen(this.config.apiPort, () => {
        console.log(`Api is listening on port ${this.config.apiPort}`);
        resolve(this.config);
      });
    });
  }
}
