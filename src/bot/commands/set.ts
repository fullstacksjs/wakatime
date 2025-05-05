import { isNull } from '@fullstacksjs/toolbox';

import type { WakatimeContext } from '../Context.ts';

import { container } from '../../config/container.ts';

const isValidId = (id: string | undefined): id is string =>
  Boolean(id?.length === 36 && id.split('-').length === 5);

export const setCommand = async (ctx: WakatimeContext) => {
  const { api } = container.cradle;
  const message = ctx.update.channel_post?.text ?? ctx.update.message?.text;
  const [id, rawUsername] = message?.split(' ').slice(1) ?? [];

  if (!isValidId(id)) return ctx.replyToMessage('<b>Wrong Input</b>\nInvalid id');

  const username = rawUsername?.replace('@', '');
  if (isNull(username)) return ctx.replyToMessage('<b>Wrong Input</b>\nUsername is required');

  await api.setUsername(id, username);

  return ctx.replyToMessage(ctx.messages.usernameSet);
};
