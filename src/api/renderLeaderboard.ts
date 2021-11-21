import { toInteger } from '@fullstacksjs/toolbox';
import { Request, Response } from 'express';
import { Container } from 'typescript-ioc';

import { LeaderboardRepo } from '../repos/LeaderboardRepo';

interface QueryType {
  size?: string;
}

export const renderLeaderboard = async (
  req: Request<unknown, unknown, unknown, QueryType>,
  res: Response,
) => {
  const wakatimeRepo = Container.get(LeaderboardRepo);
  const size = toInteger(req.query.size ?? '3');
  const winners = await wakatimeRepo.getTopUsers(size);
  return res.render('index.ejs', { winners });
};
