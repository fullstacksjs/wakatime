import { LeaderboardRepo, ScheduleRepo } from 'src/repos';
import { PuppeteerService } from 'src/Services/PuppeteerService';
import { GroupScheduleService } from 'src/Services/ScheduleService';
import { WakatimeService } from 'src/Services/WakatimeService';
import { ConstantConfiguration, ContainerConfiguration, Scope } from 'typescript-ioc';

import { getConfig } from './getConfig';

type ContainerConfig = (ConstantConfiguration | ContainerConfiguration)[];

const config = getConfig();

export const container: ContainerConfig = [
  { bindName: 'config', to: config },
  {
    bind: LeaderboardRepo,
    factory: () => new LeaderboardRepo(config.wakatimeDbFilePath, { weeks: {}, users: {} }),
    scope: Scope.Singleton,
  },
  {
    bind: ScheduleRepo,
    factory: () => new ScheduleRepo(config.scheduleDbFilePath, { schedules: {} }),
    scope: Scope.Singleton,
  },
  { bind: GroupScheduleService, to: GroupScheduleService, scope: Scope.Singleton },
  { bind: WakatimeService, to: WakatimeService, scope: Scope.Singleton },
  { bind: PuppeteerService, to: PuppeteerService, scope: Scope.Singleton },
];
