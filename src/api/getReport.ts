import type { Request, Response } from 'express';

import { toInteger } from '@fullstacksjs/toolbox';

import { container } from '../config/container.ts';

interface QueryType {
  size?: string;
}

export const getReport = async (
  req: Request<unknown, unknown, unknown, QueryType>,
  res: Response,
) => {
  try {
    const size = toInteger(req.query.size?.toString() ?? '3', 3);
    const day = await container.cradle.leaderboardService.getDay(size);
    return res.json(day.report);
  } catch (e) {
    if (e instanceof Error) return res.status(500).json({ message: e.message });
    return res.status(500).json({ message: e });
  }
};
