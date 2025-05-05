import { isNull } from '@fullstacksjs/toolbox';
import { createError, defineEventHandler, getHeader, readValidatedBody } from 'h3';
import * as v from 'valibot';

import { container } from '../config/container.ts';
import { UserNotFoundError } from '../core/repos/Repo.ts';

const schema = v.object({ id: v.string(), username: v.string() });

export const setUsername = defineEventHandler({
  handler: async event => {
    const repo = container.cradle.repo;

    const { id, username } = await readValidatedBody(event, value => v.parse(schema, value));

    if (isNull(id) || isNull(username)) {
      throw createError({ statusCode: 400, statusMessage: 'bad.input' });
    }

    try {
      await repo.setTelegramUsername(id, username);
      return { status: 201 };
    } catch (e) {
      if (e instanceof UserNotFoundError) {
        throw createError({ statusCode: 404, statusMessage: e.message });
      }

      throw e;
    }
  },

  onRequest: event => {
    const auth = getHeader(event, 'Authorization');

    if (!auth) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
    }

    const token = auth.split(' ')[1];

    if (token !== container.cradle.config.api.token) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
  },
});
