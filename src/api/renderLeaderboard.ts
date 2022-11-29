import { toInteger } from '@fullstacksjs/toolbox';
import type { Request, Response } from 'express';

import { container } from '../config/container.js';

interface QueryType {
  size?: string;
}

export const renderLeaderboard = async (
  req: Request<unknown, unknown, unknown, QueryType>,
  res: Response,
) => {
  const size = toInteger(req.query.size ?? '3');
  const contactList = [
    { name: 'Telegram', url: 'kutt.it/fsk-tg' },
    { name: 'Youtube', url: 'kutt.it/fsk-yt' },
    { name: 'Discord', url: 'kutt.it/fsk-discord' },
    { name: 'Instagram', url: 'kutt.it/fsk-insta' },
    { name: 'Twitter', url: 'kutt.it/fsk-twitter' },
    { name: 'Twitch', url: 'kutt.it/fsk-twitch' },
  ];
  const leaderboard = await container.cradle.leaderboardService.getLeaderboard(size);
  return res.render('index.ejs', { leaderboard, contactList });
};
