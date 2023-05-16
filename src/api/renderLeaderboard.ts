import { toInteger } from '@fullstacksjs/toolbox';
import type { Request, Response } from 'express';

import { container } from '../config/container.js';

interface QueryType {
  size?: string;
}

export const renderWeekLeaderboard = async (
  req: Request<unknown, unknown, unknown, QueryType>,
  res: Response,
) => {
  const size = toInteger(req.query.size ?? '3');
  const leaderboard = await container.cradle.leaderboardService.getWeek(size);

  return res.render('index.ejs', {
    title: leaderboard.weekTitle,
    usages: leaderboard.report.usages,
  });
};

export const renderDayLeaderboard = async (
  req: Request<unknown, unknown, unknown, QueryType>,
  res: Response,
) => {
  const size = toInteger(req.query.size ?? '7');
  const leaderboard = await container.cradle.leaderboardService.getDay(size);

  return res.render('index.ejs', {
    title: leaderboard.dayTitle,
    winners: leaderboard.report.usages.slice(0, 3),
    usages: leaderboard.report.usages.slice(3),
  });
};
