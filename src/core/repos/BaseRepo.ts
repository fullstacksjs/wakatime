import type { RequiredBy } from '@fullstacksjs/toolbox';
import { isNull } from '@fullstacksjs/toolbox';
import fs from 'fs/promises';
import { JSONFile, Low } from 'lowdb';
import path from 'path';

export class BaseRepo<T> {
  db!: Low<T>;
  protected initialState: T | undefined;

  protected assertInitialized(this: BaseRepo<T>): asserts this is RequiredBy<this, 'db'> {
    if (isNull(this.db)) throw Error('You need to init db before use');
  }

  constructor(private filePath: string) {}

  async initiate() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const adapter = new JSONFile<T>(this.filePath);
    this.db = new Low<T>(adapter);
    await this.seedDb();
    return this;
  }

  async seedDb() {
    this.assertInitialized();

    await this.db.read();
    if (!isNull(this.db.data)) return;

    if (isNull(this.initialState)) throw Error('initialState is undefined');
    this.db.data ??= this.initialState;
    await this.db.write();
  }
}
