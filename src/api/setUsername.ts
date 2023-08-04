import { isNull } from '@fullstacksjs/toolbox';
import type { Request, Response } from 'express';
import { container } from '../config/container.js';

interface Body {
  id: string;
  username: string;
}

export const setUsername = async (req: Request<unknown, unknown, Body>, res: Response) => {
  const repo = container.cradle.repo;
  const { id, username } = req.body;

  if (isNull(id) || isNull(username))
    return res.status(400).json({ status: 400, message: 'bad.input' });

  try {
    await repo.setTelegramUsername(id, username);
    return res.json({ status: 200 });
  } catch (e) {
    return res.status(404).json({ status: 404, message: 'not.found' });
  }
};
