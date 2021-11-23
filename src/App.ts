import { Api } from './api/Api.js';
import { Bot } from './bot/Bot.js';
import { container } from './config/container.js';

export class App {
  private bot: Bot;
  private api: Api;

  async initiate() {
    await container.cradle.reportRepo.initiate();
    await container.cradle.scheduleRepo.initiate();
    await container.cradle.userRepo.initiate();
  }

  constructor() {
    this.api = new Api(container.cradle);
    this.bot = new Bot(container.cradle);
    process.once('SIGINT', () => {
      this.bot.stop();
    });
    process.once('SIGTERM', () => {
      this.bot.stop();
    });
  }

  async start() {
    await this.bot.initiate();
    await this.api.listen();
    await this.bot.start();
  }

  stop() {
    this.bot.stop();
  }
}
