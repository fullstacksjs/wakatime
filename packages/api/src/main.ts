import fs from 'fs/promises';
import path from 'path';

import { WakatimeRepo } from './db.js';
import { getConfig } from './getConfig.js';

const config = getConfig();

await fs.mkdir(path.dirname(config.dbFilePath), { recursive: true });

const db = await new WakatimeRepo(config.dbFilePath).init();
