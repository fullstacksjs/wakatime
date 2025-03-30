import type { App } from 'h3';

import { createApp, toNodeListener } from 'h3';
import { createServer } from 'node:http';

import type { Container } from '../config/initContainer.ts';
import type { Bot } from './Bot.ts';

export class BotApi {
  private app: App;
  private bot: Bot;
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
    this.bot = opts.bot;

    this.app = createApp();
  }

  public async registerWebhook(webhookUrl: string) {
    this.app.use(this.bot.createH3WebhookCallback());
    await this.bot.api.setWebhook(webhookUrl);
  }

  public start() {
    void this.bot.start();
    const server = createServer(toNodeListener(this.app));

    return new Promise(resolve => {
      server.listen(this.config.botPort, () => {
        console.log(`listening on port ${this.config.botPort}`);
        resolve(this.config);
      });
    });
  }
}
