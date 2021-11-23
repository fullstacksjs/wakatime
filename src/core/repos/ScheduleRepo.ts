import { isNull } from '@fullstacksjs/toolbox';

import { BaseRepo } from './BaseRepo';

interface ScheduleDb {
  schedules: {
    [key: GroupId]: Schedule;
  };
}

export class ScheduleRepo extends BaseRepo<ScheduleDb> {
  protected override initialState: ScheduleDb | undefined = { schedules: {} };

  constructor(opts: Container) {
    super(opts.config.scheduleDbFilePath);
  }

  async getSchedules() {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();
    return this.db.data!.schedules;
  }

  async addSchedule(groupId: GroupId, schedule: Schedule) {
    if (isNull(this.db)) throw Error('You need to init db before use');
    await this.db.read();
    const schedules = this.db.data!.schedules;
    schedules[groupId] = schedule;
    await this.db.write();
  }
}
