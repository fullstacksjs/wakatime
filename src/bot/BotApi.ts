import type { Express } from 'express';

import express from 'express';

import type { Container } from '../config/initContainer.ts';
import type { Bot } from './Bot.ts';

export class BotApi {
  private app: Express;
  private bot: Bot;
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
    this.bot = opts.bot;

    this.app = express();
    this.app.use(express.json());
  }

  public async registerWebhook(webhookUrl: string) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.app.use(this.bot.createExpressWebhookCallback());
    await this.bot.api.setWebhook(webhookUrl);
  }

  public start() {
    void this.bot.start();
    return new Promise(resolve => {
      this.app.listen(this.config.botPort, () => {
        console.log(`listening on port ${this.config.botPort}`);
        resolve(this.config);
      });
    });
  }
}
