import dedent from 'dedent';
import * as v from 'valibot';

import type { WakatimeContext } from '../Context.ts';

import { container } from '../../config/container.ts';

const sizeSchema = v.optional(
  v.pipe(v.string(), v.transform(Number), v.minValue(1), v.maxValue(100)),
  '10',
);
const typeSchema = v.optional(
  v.pipe(
    v.string(),
    v.transform(x => {
      if (x === 'false') return 'WithoutUsername';
      if (x === 'true') return 'WithUsername';
      return undefined;
    }),
  ),
);
export const usersCommand = async (ctx: WakatimeContext) => {
  const repo = container.cradle.api;
  const firstArg = ctx.message?.text?.split(' ')[1];
  const secondArg = ctx.message?.text?.split(' ')[2];

  const size = v.parse(sizeSchema, firstArg);
  const type = v.parse(typeSchema, secondArg);
  const users = await repo.getUserList({ size, type });

  const usersList = users
    .sort((a, b) => a.publicName.localeCompare(b.publicName))
    .reduce((a, u) => `${a}${u.dumpInfo()}\n\n`, '');

  return ctx.replyToMessage(
    dedent`
      <b>Users:</b>

      ${usersList}`,
  );
};
