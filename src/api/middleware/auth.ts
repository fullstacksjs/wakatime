import type { Middleware } from 'h3';

import { HTTPError } from 'h3';

import { container } from '../../config/container.ts';

export const authMiddleware: Middleware = event => {
  const auth = event.req.headers.get('Authorization');

  if (!auth) {
    throw HTTPError.status(401, 'Unauthorized');
  }

  const token = auth.split(' ')[1];

  if (token !== container.cradle.config.api.token) {
    console.warn('Invalid token', { authorization: auth, token });
    throw HTTPError.status(403, 'Forbidden');
  }
};
