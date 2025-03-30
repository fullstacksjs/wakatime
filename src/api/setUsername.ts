import { isNull } from '@fullstacksjs/toolbox';
import { createError, defineEventHandler, readValidatedBody } from 'h3';
import * as v from 'valibot';

import { container } from '../config/container.ts';

const schema = v.object({ id: v.string(), username: v.string() });

export const setUsername = defineEventHandler(async event => {
  const repo = container.cradle.repo;

  const { id, username } = await readValidatedBody(event, value => v.parse(schema, value));

  if (isNull(id) || isNull(username)) {
    throw createError({ statusCode: 400, statusMessage: 'bad.input' });
  }

  try {
    await repo.setTelegramUsername(id, username);
    return { status: 201 };
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'not.found' });
  }
});
