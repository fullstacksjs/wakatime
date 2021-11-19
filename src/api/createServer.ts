import express from 'express';
import path from 'path';

import { getDirname } from '../utils/getDirname';
import { WakatimeRepo } from '../WakatimeRepo';
import { createRenderLeaderboardRoute } from './routes/createRenderLeaderboardRoute';

export const createServer = (config: Config, db: WakatimeRepo) => {
  const app = express();
  const viewPath = path.join(getDirname(), '../web');

  app.set('view engine', 'ejs');
  app.set('views', viewPath);

  app.use(express.static(viewPath));
  app.get('/', createRenderLeaderboardRoute(db));

  return () => app.listen(config.port, () => console.log(`listening on port ${config.port}`));
};
