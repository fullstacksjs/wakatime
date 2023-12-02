import awilix from 'awilix';
import { Bot as Grammy, webhookCallback } from 'grammy';

import { container } from '../config/container.js';
import type { Container } from '../config/initContainer.js';
import { day } from './commands/day.js';
import { helpCommand } from './commands/help.js';
import { setCommand } from './commands/set.js';
import { startCommand } from './commands/start.js';
import { usersCommand } from './commands/users.js';
import { WakatimeContext } from './Context.js';
import { authMiddleware } from './middleware/auth.js';
import { adventCommand } from './commands/advent.js';

export class Bot extends Grammy<WakatimeContext> {
  constructor(opts: Container) {
    super(opts.config.botToken, { ContextConstructor: WakatimeContext });
    container.register({ grammy: awilix.asValue(this.api) });
  }

  async initiate() {
    await this.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Show help text' },
      { command: 'day', description: 'current day leaderboard' },
      { command: 'users', description: 'list users' },
      { command: 'set', description: 'assign an username to a wakatime id' },
    ]);

    this.command('start', startCommand);
    this.command('help', helpCommand);
    this.command('day', day);
    this.command('set', authMiddleware, setCommand);
    this.command('advent', adventCommand);
    this.command('users', authMiddleware, usersCommand);

    this.catch = function handleError(e) {
      console.error(e);
    };
  }

  createExpressWebhookCallback() {
    return webhookCallback(this, 'express', 'return', 50_000);
  }
}
