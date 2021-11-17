import { isNull } from '@fullstacksjs/toolbox';
import fs from 'fs/promises';
import { JSONFile, Low } from 'lowdb';
import path from 'path';

export class ScheduleRepo {
  db: Low<ScheduleDb> | undefined;

  constructor(private dbFilePath: string) {}

  async init() {
    await fs.mkdir(path.dirname(this.dbFilePath), { recursive: true });
    const adapter = new JSONFile<ScheduleDb>(this.dbFilePath);
    this.db = new Low<ScheduleDb>(adapter);
    await this.seedDb();
    return this;
  }

  async seedDb() {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();
    if (!isNull(this.db.data)) return;
    this.db.data ??= { schedules: {} };
    await this.db.write();
  }

  async getSchedules() {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();
    return this.db.data?.schedules;
  }
}
