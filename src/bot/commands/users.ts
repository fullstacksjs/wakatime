import { dedent } from 'ts-dedent';

import { container } from '../../config/container.js';
import type { UserFilter } from '../../core/repos/Repo.js';
import type { WakatimeContext } from '../Context.js';

const getFilter = (message: string | undefined): UserFilter => {
  const flag = message?.split(' ')[1];
  if (flag === 'false') return 'WithoutUsername';
  if (flag === 'true') return 'WithUsername';
  return undefined;
};

export const usersCommand = async (ctx: WakatimeContext) => {
  const repo = container.cradle.repo;
  const filter = getFilter(ctx.message?.text);
  const users = await repo.getUserList(filter);

  const usersList = users
    .sort((a, b) => a.publicName.localeCompare(b.publicName))
    .reduce((a, u) => `${a}${u.dumpInfo()}\n\n`, '');

  return ctx.replyToMessage(
    dedent`
      <b>Users:</b>

      ${usersList}`,
  );
};
