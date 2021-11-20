import { isNull } from '@fullstacksjs/toolbox';
import { CronJob } from 'cron';

import { ScheduleRepo } from './ScheduleRepo';

interface ScheduleJob {
  [key: GroupId]: CronJob;
}

export class ScheduleService {
  private jobs: ScheduleJob = {};
  constructor(private repo: ScheduleRepo) {}
  async init(cb: any) {
    const schedules = await this.repo.getSchedules();
    Object.entries(schedules).forEach(([id, schedule]) => this.addOne(id, schedule, cb));
  }

  addOne(id: GroupId, [day, hrs, mins]: Schedule, cb: any) {
    const currentJob = this.jobs[id];
    if (!isNull(currentJob)) currentJob.stop();
    this.jobs[id] = new CronJob(`${mins} ${hrs} * * ${day - 1}`, cb(id), null, true, 'Asia/Tehran');
  }
}
