import awilix from 'awilix';
import type { Api as GrammyApi } from 'grammy';

import { Bot } from '../bot/Bot.js';
import { ApiSDK } from '../core/services/ApiSDK.js';
import { LeaderboardService } from '../core/services/LeaderboardService.js';
import { WakatimeSDK } from '../core/services/WakatimeSDK.js';
import type { Repo } from '../core/repos/Repo.js';
import { createRepo } from '../core/repos/Repo.js';
import { container } from './container.js';
import { getConfig } from './getConfig.js';

export interface Container {
  config: Config;
  repo: Repo;
  leaderboardService: LeaderboardService;
  grammy: GrammyApi;
  bot: Bot;
  api: ApiSDK;
  wakatime: WakatimeSDK;
}

export async function registerApiContainer() {
  const config = getConfig();
  const repo = await createRepo(config.dbFilePath);

  container.register({
    config: awilix.asValue(config),
    repo: awilix.asValue(repo),
    leaderboardService: awilix.asClass(LeaderboardService).singleton(),
    wakatime: awilix.asClass(WakatimeSDK).singleton(),
  });

  return container.cradle;
}

export async function registerBotContainer() {
  const config = getConfig();

  container.register({
    config: awilix.asValue(config),
    bot: awilix.asClass(Bot).singleton(),
    leaderboardService: awilix.asClass(LeaderboardService).singleton(),
    api: awilix.asClass(ApiSDK).singleton(),
    repo: awilix.asValue({} as Repo),
  });

  await container.cradle.bot.initiate();
  return container.cradle;
}
