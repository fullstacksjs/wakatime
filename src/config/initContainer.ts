import type { Api as GrammyApi } from 'grammy';

import * as awilix from 'awilix';

import type { Repo } from '../core/repos/Repo.ts';

import { Bot } from '../bot/Bot.ts';
import { createRepo } from '../core/repos/Repo.ts';
import { AdventService } from '../core/services/AdventService.ts';
import { ApiSDK } from '../core/services/ApiSDK.ts';
import { LeaderboardService } from '../core/services/LeaderboardService.ts';
import { WakatimeSDK } from '../core/services/WakatimeSDK.ts';
import { container } from './container.ts';
import { getConfig } from './getConfig.ts';

export interface Container {
  config: Config;
  repo: Repo;
  leaderboardService: LeaderboardService;
  adventService: AdventService;
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
    adventService: awilix.asClass(AdventService).singleton(),
    api: awilix.asClass(ApiSDK).singleton(),
    repo: awilix.asValue({} as Repo),
    wakatime: awilix.asClass(WakatimeSDK).singleton(),
  });

  await container.cradle.bot.initiate();
  return container.cradle;
}
