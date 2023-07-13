import { container } from '../config/container.js';

import { toInteger } from '@fullstacksjs/toolbox';
import type { Request, Response } from 'express';

interface QueryType {
  size?: string;
}

export const getReport = async (
  req: Request<unknown, unknown, unknown, QueryType>,
  res: Response,
) => {
  const size = toInteger(req.query.size?.toString() ?? '3', 3);
  const day = await container.cradle.leaderboardService.getDay(size);

  res.json(day.report);
};
