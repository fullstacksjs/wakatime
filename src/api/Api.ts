import express, { Express } from 'express';
import { InjectValue } from 'typescript-ioc';

import { toAbsolutePath } from '../utils/path';
import { renderLeaderboard } from './renderLeaderboard.js';

export class Api {
  @InjectValue('config') private config!: Config;
  private app: Express;

  constructor() {
    this.app = express();
    const viewPath = toAbsolutePath('./web');
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
