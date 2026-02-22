import type { BotError, NextFunction } from 'grammy';

import { isObject } from '@fullstacksjs/toolbox';

import type { WakatimeContext } from '../Context';

import { HttpError } from '../../core/services/HttpClient.ts';

interface SendErrorPayload {
  chat_id: number;
  text: string;
}

function isSendErrorPayload(payload: unknown): payload is SendErrorPayload {
  return isObject(payload) && 'chat_id' in payload && 'text' in payload;
}

export async function reportError(err: BotError<WakatimeContext>, next: NextFunction) {
  const { error } = err;

  if (error instanceof HttpError) {
    const { statusCode, statusMessage, url } = error;
    await err.ctx.reportError(
      `Failed with status ${statusCode}\nError: ${statusMessage}\nURL: ${url}`,
    );
    return;
  } else if (isSendErrorPayload(error)) {
    const { chat_id: chatId, text } = error;
    return err.ctx.report(`Cannot send message to ${chatId}, Error: ${text}`);
  }

  return next();
}
