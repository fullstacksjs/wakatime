import { H3 } from 'h3';
import { serve } from 'h3/node';

import type { Container } from '../config/initContainer.ts';

import { getReport } from './getReport.ts';
import { getUsers } from './getUsers.ts';
import { authMiddleware } from './middleware/auth.ts';
import { setUsername } from './setUsername.ts';

export class Api {
  private app: H3;
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;

    this.app = new H3();

    this.app.get('/api/day', getReport);
    this.app.get('/api/users', getUsers);
    this.app.put('/api/users', setUsername, { middleware: [authMiddleware] });
  }

  public async start() {
    const server = serve(this.app, { port: this.config.api.port });
    await server.ready();
    console.log(`Api is listening on port ${this.config.api.port}`);
    return this.config;
  }
}
