import { defineEventHandler, getValidatedQuery } from 'h3';
import * as v from 'valibot';

import { container } from '../config/container.ts';

const schema = v.object({
  size: v.optional(v.pipe(v.string(), v.transform(Number), v.minValue(1), v.maxValue(100)), '10'),
  page: v.optional(v.pipe(v.string(), v.transform(Number), v.minValue(0)), '0'),
  type: v.optional(v.union([v.literal('WithUsername'), v.literal('WithoutUsername')]), undefined),
});
export const getUsers = defineEventHandler(async event => {
  const repo = container.cradle.repo;
  const { size, page, type } = await getValidatedQuery(event, query => v.parse(schema, query));

  const users = await repo.getUserList({ size, page, type });
  return users;
});
