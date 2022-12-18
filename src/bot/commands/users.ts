import { dedent } from 'ts-dedent';

import { container } from '../../config/container.js';
import type { WakatimeContext } from '../Context.js';

export const usersCommand = async (ctx: WakatimeContext) => {
  const flag = ctx.message?.text?.split(' ')[1];
  const userRepo = container.cradle.userRepo;
  const users = await userRepo.list();
  const filteredUser =
    flag === 'true'
      ? users.filter(u => !u.telegramUsername)
      : flag === 'false'
      ? users.filter(u => u.telegramUsername)
      : users;
  const usersList = filteredUser
    .sort((a, b) => a.publicName.localeCompare(b.publicName ?? 'Z') ?? -1)
    .reduce((a, u) => `${a}${u.dumpInfo()}\n\n`, '');

  return ctx.replyToMessage(
    dedent`
  <b>Users:</b>

  ${usersList}`,
  );
};
