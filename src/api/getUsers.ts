import { defineEventHandler } from 'h3';

import { container } from '../config/container.ts';

export const getUsers = defineEventHandler(async () => {
  const repo = container.cradle.repo;

  const users = await repo.getUserList();
  return users;
});
