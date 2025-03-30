import awilix from 'awilix';
import { Composer, Bot as Grammy, webhookCallback } from 'grammy';

import type { Container } from '../config/initContainer.ts';

import { container } from '../config/container.ts';
import { adventCommand } from './commands/advent.ts';
import { boundaryHandler } from './commands/boundaryHandler.ts';
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
    const composer = new Composer<WakatimeContext>();

    composer.command('start', startCommand);
    composer.command('help', helpCommand);
    composer.command('day', day);
    composer.command('set', authMiddleware, setCommand);
    composer.command('advent', adventCommand);
    composer.command('users', authMiddleware, usersCommand);
    this.errorBoundary(boundaryHandler).use(composer);
    this.use(composer);

    this.catch = function handleError(e) {
      console.error(e);
    };
  }
}
