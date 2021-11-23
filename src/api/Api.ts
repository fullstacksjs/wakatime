import express, { Express } from 'express';

import { toAbsolutePath } from '../utils/path';
import { renderLeaderboard } from './renderLeaderboard.js';

export class Api {
  private config: Config;
  private app: Express;

  constructor(opts: Container) {
    this.config = opts.config;
    this.app = express();
    const viewPath = toAbsolutePath('/api/web');

    this.app.set('view engine', 'ejs');
    this.app.set('views', viewPath);

    this.app.use(express.static(viewPath));
    this.app.get('/', renderLeaderboard);
  }

  public listen() {
    return new Promise(resolve => {
      this.app.listen(this.config.port, () => resolve(this.config));
    });
  }
}
