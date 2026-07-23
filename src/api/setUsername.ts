import { isNull } from '@fullstacksjs/toolbox';
import { defineHandler, HTTPError, readValidatedBody } from 'h3';
import * as v from 'valibot';

import { container } from '../config/container.ts';
import { UserNotFoundError } from '../core/repos/Repo.ts';

const schema = v.object({ id: v.string(), username: v.string() });

export const setUsername = defineHandler(async event => {
  const { repo } = container.cradle;

  const { id, username } = await readValidatedBody(event, value => v.parse(schema, value));

  if (isNull(id) || isNull(username)) {
    throw HTTPError.status(400, 'bad.input');
  }

  try {
    await repo.setTelegramUsername(id, username);
    return { status: 201 };
  } catch (e) {
    if (e instanceof UserNotFoundError) {
      throw HTTPError.status(404, e.message);
    }

    throw e;
  }
});
