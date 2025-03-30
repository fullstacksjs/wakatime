import { isNull, isString } from '@fullstacksjs/toolbox';

import type { WakatimeContext } from '../Context.ts';

import { container } from '../../config/container.ts';

const isValidId = (id: string | undefined): id is string =>
  Boolean(id?.length === 36 && id.split('-').length === 5);

export const setCommand = async (ctx: WakatimeContext) => {
  try {
    const { api } = container.cradle;
    const [id, rawUsername] = ctx.message?.text?.split(' ').slice(1) ?? [];
    const username = rawUsername?.replace('@', '');

    if (!isValidId(id)) return await ctx.replyToMessage('<b>Wrong Input</b>\nInvalid id');
    if (isNull(username))
      return await ctx.replyToMessage('<b>Wrong Input</b>\nUsername is required');

    await api.setUsername(id, username);

    return await ctx.replyToMessage(ctx.messages.usernameSet);
  } catch (e) {
    if (e instanceof Error) return ctx.reportError(e.message);
    if (isString(e)) return ctx.reportError(e);

    return ctx.reportError('Unknown Error');
  }
};
