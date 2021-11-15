import express from 'express';
import path from 'path';

import { getDirname } from '../utils/getDirname';
import { WakatimeRepo } from '../WakatimeRepo';

export const createServer = (config: Config, _db: WakatimeRepo) => {
  const app = express();
  const viewPath = path.join(getDirname(), '../web');

  app.set('view engine', 'ejs');
  app.set('views', viewPath);

  app.use(express.static(viewPath));

  return () => app.listen(config.port);
};
