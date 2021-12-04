import awilix, { AwilixContainer } from 'awilix';

import { ReportRepo } from '../core/repos/ReportRepo.js';
import { ScheduleRepo } from '../core/repos/ScheduleRepo.js';
import { UserRepo } from '../core/repos/UserRepository.js';
import { LeaderboardService } from '../core/Services/LeaderboardService.js';
import { PuppeteerService } from '../core/Services/PuppeteerService.js';
import { GroupScheduleService } from '../core/Services/ScheduleService.js';
import { WakatimeService } from '../core/Services/WakatimeService.js';
import { getConfig } from './getConfig.js';

export function initContainer(container: AwilixContainer<Container>) {
  container.register({
    config: awilix.asValue(getConfig()),

    // Services
    groupScheduleService: awilix.asClass(GroupScheduleService).singleton(),
    wakatimeService: awilix.asClass(WakatimeService).singleton(),
    puppeteerService: awilix.asClass(PuppeteerService).singleton(),
    leaderboardService: awilix.asClass(LeaderboardService).singleton(),

    // Repos
    reportRepo: awilix.asClass(ReportRepo).singleton(),
    scheduleRepo: awilix.asClass(ScheduleRepo).singleton(),
    userRepo: awilix.asClass(UserRepo).singleton(),
  });
}
