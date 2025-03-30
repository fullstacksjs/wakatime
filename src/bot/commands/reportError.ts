import type { BotError, NextFunction } from 'grammy';

import { isObject } from '@fullstacksjs/toolbox';
import { AxiosError } from 'axios';

import type { WakatimeContext } from '../Context';

interface SendErrorPayload {
  chat_id: number;
  text: string;
}

function isSendErrorPayload(payload: unknown): payload is SendErrorPayload {
  return isObject(payload) && 'chat_id' in payload && 'text' in payload;
}

function isHTTPError(error: unknown): error is AxiosError & {
  response: { status: number };
  request: { method: string; res: { responseUrl: string } };
} {
  if (!(error instanceof AxiosError)) return false;
  if (!error.response?.status || error.response.status < 400) return false;

  return true;
}

export async function reportError(err: BotError<WakatimeContext>, next: NextFunction) {
  const error = err.error;

  if (isHTTPError(error)) {
    const method = error.request.method;
    const url = error.request.res.responseUrl;
    const status = error.response.status;

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return err.ctx.reportError(`Failed to ${method} "${url}" with status ${status}`);
  } else if (isSendErrorPayload(error)) {
    const { chat_id: chatId, text } = error;
    return err.ctx.report(`Cannot send message to ${chatId}, Error: ${text}`);
  }

  return next();
}
