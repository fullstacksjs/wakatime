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
    await container.cradle.bot.initiate();
  }

  constructor() {
    this.api = new Api(container.cradle);
  }

  async start() {
    await this.api.listen();
  }
}
