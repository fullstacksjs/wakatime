import { toInteger } from '@fullstacksjs/toolbox';
import { Request, Response } from 'express';

import { WakatimeRepo } from '../../WakatimeRepo';

export const createRenderLeaderboardRoute =
  (db: WakatimeRepo) => async (req: Request, res: Response) => {
    // eslint-disable-next-line dot-notation
    const size = toInteger((req.query['size'] as string) ?? '3');
    const winners = await db.getTopUsers(size);
    return res.render('index.ejs', { winners });
  };
