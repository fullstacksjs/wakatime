import awilix from 'awilix';
import type { Api, RawApi } from 'grammy';

import { Bot } from '../bot/Bot.js';
import type { Repo } from '../core/repos/Repo.js';
import { createRepo } from '../core/repos/Repo.js';
import { LeaderboardService } from '../core/Services/LeaderboardService.js';
import { container } from './container.js';
import { getConfig } from './getConfig.js';

export interface Container {
  config: Config;
  repo: Repo;
  leaderboardService: LeaderboardService;
  api: Api<RawApi>;
  bot: Bot;
}

export async function initContainer() {
  const config = getConfig();
  const repo = await createRepo(config.dbFilePath);

  container.register({
    config: awilix.asValue(config),
    bot: awilix.asClass(Bot).singleton(),
    repo: awilix.asValue(repo),

    // Services
    leaderboardService: awilix.asClass(LeaderboardService).singleton(),
  });

  await container.cradle.bot.initiate();
  return container.cradle;
}
