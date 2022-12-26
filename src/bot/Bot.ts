import awilix from 'awilix';
import { Bot as Grammy, webhookCallback } from 'grammy';

import { container } from '../config/container.js';
import type { Container } from '../config/initContainer.js';
import { day } from './commands/day.js';
import { helpCommand } from './commands/help.js';
import { setCommand } from './commands/set.js';
import { startCommand } from './commands/start.js';
import { usersCommand } from './commands/users.js';
import { week } from './commands/week.js';
import { WakatimeContext } from './Context.js';
import { authMiddleware } from './middleware/auth.js';

export class Bot extends Grammy<WakatimeContext> {
  constructor(opts: Container) {
    super(opts.config.botToken, { ContextConstructor: WakatimeContext });
    container.register({ api: awilix.asValue(this.api) });
  }

  async initiate() {
    await this.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'help', description: 'Show help text' },
      { command: 'week', description: 'current week leaderboard' },
      { command: 'day', description: 'current day leaderboard' },
      { command: 'users', description: 'list users' },
      { command: 'set', description: 'assign an username to a wakatime id' },
    ]);

    this.command('start', startCommand);
    this.command('help', helpCommand);
    this.command('week', week);
    this.command('day', day);
    this.command('set', authMiddleware, setCommand);
    this.command('users', authMiddleware, usersCommand);
  }

  createExpressWebhookCallback() {
    return webhookCallback(this, 'express', 'return', 50_000);
  }
}
