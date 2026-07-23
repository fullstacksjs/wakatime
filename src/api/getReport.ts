import { defineHandler, getValidatedQuery, HTTPError } from 'h3';
import * as v from 'valibot';

import { container } from '../config/container.ts';

const schema = v.object({ size: v.optional(v.pipe(v.string(), v.transform(Number)), '3') });
export const getReport = defineHandler(async event => {
  const leaderBoardService = container.cradle.leaderboardService;

  try {
    const { size } = await getValidatedQuery(event, value => v.parse(schema, value));
    const day = await leaderBoardService.getDay(size);
    return Response.json(day.report);
  } catch (error) {
    if (error instanceof v.ValiError) {
      throw HTTPError.status(400, 'Bad Input');
    }

    console.error(error);
    throw HTTPError.status(500, 'Internal Server Error');
  }
});
