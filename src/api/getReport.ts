import { createError, defineEventHandler, getValidatedQuery } from 'h3';
import * as v from 'valibot';

import { container } from '../config/container.ts';

const schema = v.object({ size: v.optional(v.number(), 3) });
export const getReport = defineEventHandler(async event => {
  const leaderBoardService = container.cradle.leaderboardService;

  try {
    const { size } = await getValidatedQuery(event, value => v.parse(schema, value));
    const day = await leaderBoardService.getDay(size);
    return day.report;
  } catch (error) {
    if (error instanceof v.ValiError) {
      throw createError({ statusCode: 400, statusMessage: 'bad.input' });
    }

    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
