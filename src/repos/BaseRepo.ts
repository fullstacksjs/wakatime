import { isNull } from '@fullstacksjs/toolbox';
import fs from 'fs/promises';
import { JSONFile, Low } from 'lowdb';
import path from 'path';
import { InjectValue } from 'typescript-ioc';

export class BaseRepo<T> {
  @InjectValue('config') private config!: Config;
  db: Low<T> | undefined;

  constructor(private filePath: string, private initialState: T) {}

  async initiate() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const adapter = new JSONFile<T>(this.filePath);
    this.db = new Low<T>(adapter);
    await this.seedDb();
    return this;
  }

  async seedDb() {
    if (isNull(this.db)) throw Error('You need to init db before use');

    await this.db.read();
    if (!isNull(this.db.data)) return;
    this.db.data ??= this.initialState;
    await this.db.write();
  }
}
