import { Inject, InjectValue } from 'typescript-ioc';

import { Api } from './api/Api';
import { Bot } from './bot/Bot';
import { ScheduleRepo, LeaderboardRepo } from './repos';

export class App {
  @Inject() private wakatimeRepo!: LeaderboardRepo;
  @Inject() private scheduleRepo!: ScheduleRepo;
  @InjectValue('config') private config!: Config;

  async start() {
    await this.wakatimeRepo.initiate();
    await this.scheduleRepo.initiate();

    const api = new Api();
    const bot = await new Bot(this.config.botToken).initiate();

    await api.listen();
    await bot.start();

    process.once('SIGINT', bot.stop);
    process.once('SIGTERM', bot.stop);
  }
}
