import awilix from 'awilix';
import { Bot as Grammy, webhookCallback } from 'grammy';

import type { Container } from '../config/initContainer.ts';

import { container } from '../config/container.ts';
import { adventCommand } from './commands/advent.ts';
import { day } from './commands/day.ts';
import { helpCommand } from './commands/help.ts';
import { setCommand } from './commands/set.ts';
import { startCommand } from './commands/start.ts';
import { usersCommand } from './commands/users.ts';
import { WakatimeContext } from './Context.ts';
import { authMiddleware } from './middleware/auth.ts';

export class Bot extends Grammy<WakatimeContext> {
  constructor(opts: Container) {
    super(opts.config.botToken, { ContextConstructor: WakatimeContext });
    container.register({ grammy: awilix.asValue(this.api) });
  }

  createExpressWebhookCallback() {
    return webhookCallback(this, 'express', 'return', 50_000);
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
}
