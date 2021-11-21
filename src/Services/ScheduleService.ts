import { isNull } from '@fullstacksjs/toolbox';
import { CronJob } from 'cron';
import { Inject } from 'typescript-ioc';

import { ScheduleRepo } from '../repos/ScheduleRepo';

interface ScheduleJob {
  [key: GroupId]: CronJob;
}

type GroupCommand = (id: GroupId) => void;

export class GroupScheduleService {
  @Inject() private scheduleRepo!: ScheduleRepo;
  private jobs: ScheduleJob = {};

  public async loadJobs(command: GroupCommand) {
    const schedules = await this.scheduleRepo.getSchedules();
    Object.entries(schedules).forEach(([id, schedule]) => this.startJob(id, schedule, command));
    return this;
  }

  public async upsertJob(groupId: GroupId, schedule: Schedule, command: GroupCommand) {
    await this.scheduleRepo.addSchedule(groupId, schedule);
    return this.startJob(groupId, schedule, command);
  }

  private startJob(id: GroupId, schedule: Schedule, command: GroupCommand) {
    const currentJob = this.jobs[id];
    if (!isNull(currentJob)) currentJob.stop();

    const [day, hrs, mins] = schedule;
    const croneTime = `${mins} ${hrs} * * ${day - 1}`;
    this.jobs[id] = new CronJob(croneTime, () => command(id), null, true, 'Asia/Tehran');
  }
}
