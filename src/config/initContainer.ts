import awilix from 'awilix';
import type { Api } from 'grammy';

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
  api: Api;
  bot: Bot;
}

export async function registerApiContainer() {
  const config = getConfig();
  const repo = await createRepo(config.dbFilePath);

  container.register({
    config: awilix.asValue(config),
    repo: awilix.asValue(repo),
    leaderboardService: awilix.asClass(LeaderboardService).singleton(),
  });

  return container.cradle;
}

export async function registerBotContainer() {
  const config = getConfig();

  container.register({
    config: awilix.asValue(config),
    bot: awilix.asClass(Bot).singleton(),
    leaderboardService: awilix.asClass(LeaderboardService).singleton(),
  });

  await container.cradle.bot.initiate();
  return container.cradle;
}
