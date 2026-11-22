import { H3 } from 'h3';
import { serve } from 'h3/node';

import type { Container } from '../config/initContainer.ts';
import type { Bot } from './Bot.ts';

export class BotApi {
  private app: H3;
  private bot: Bot;
  private config: Config;

  constructor(opts: Container) {
    this.config = opts.config;
    this.bot = opts.bot;

    this.app = new H3();
  }

  public async registerWebhook(webhookUrl: string) {
    this.app.use(this.bot.createH3WebhookCallback());
    await this.bot.api.setWebhook(webhookUrl);
    return this.listen();
  }

  public async start() {
    void this.bot.start();
    return this.listen();
  }

  private async listen() {
    const server = serve(this.app, { port: this.config.bot.port });
    await server.ready();
    console.log(`listening on port ${this.config.bot.port}`);
    return this.config;
  }
}
