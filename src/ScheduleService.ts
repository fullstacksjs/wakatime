import { isNull } from '@fullstacksjs/toolbox';
import { CronJob } from 'cron';

import { ScheduleRepo } from './ScheduleRepo';

interface ScheduleJob {
  [key: GroupId]: CronJob;
}

export class ScheduleService {
  private jobs: ScheduleJob = {};
  constructor(private repo: ScheduleRepo, private cb: (id: GroupId) => any) {}

  async init() {
    const schedules = await this.repo.getSchedules();
    Object.entries(schedules).forEach(([id, schedule]) => this.addOrUpdateOne(id, schedule));
    return this;
  }

  addOrUpdateOne(id: GroupId, [day, hrs, mins]: Schedule) {
    const currentJob = this.jobs[id];
    if (!isNull(currentJob)) currentJob.stop();
    this.jobs[id] = new CronJob(
      `${mins} ${hrs} * * ${day - 1}`,
      this.cb(id),
      null,
      true,
      'Asia/Tehran',
    );
  }
}
