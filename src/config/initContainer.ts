import awilix, { AwilixContainer } from 'awilix';

import { ReportRepo } from '../core/repos/ReportRepo';
import { ScheduleRepo } from '../core/repos/ScheduleRepo';
import { UserRepo } from '../core/repos/UserRepository';
import { LeaderboardService } from '../core/Services/LeaderboardService';
import { PuppeteerService } from '../core/Services/PuppeteerService';
import { GroupScheduleService } from '../core/Services/ScheduleService';
import { WakatimeService } from '../core/Services/WakatimeService';
import { getConfig } from './getConfig';

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
