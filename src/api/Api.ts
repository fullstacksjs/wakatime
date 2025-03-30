import type { App } from 'h3';

import { createApp, createRouter, toNodeListener } from 'h3';
import { createServer } from 'node:http';

import type { Container } from '../config/initContainer.ts';

import { getReport } from './getReport.ts';
import { getUsers } from './getUsers.ts';
import { setUsername } from './setUsername.ts';

export class Api {
  private app: App;
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;

    this.app = createApp();
    const router = createRouter();

    router.get('/api/day', getReport);
    router.get('/api/users', getUsers);
    router.put('/api/users', setUsername);

    this.app.use(router);
  }

  public start() {
    const server = createServer(toNodeListener(this.app));

    return new Promise(resolve => {
      server.listen(this.config.apiPort, () => {
        console.log(`Api is listening on port ${this.config.apiPort}`);
        resolve(this.config);
      });
    });
  }
}
