import type { BotError } from 'grammy';

import { isObject } from '@fullstacksjs/toolbox';

import type { WakatimeContext } from '../Context.ts';

import { HttpError } from '../../core/services/HttpClient.ts';
import { escapeHTML } from '../../utils/html.ts';

interface SendErrorPayload {
  chat_id: number;
  text: string;
}

function isSendErrorPayload(payload: unknown): payload is SendErrorPayload {
  return isObject(payload) && 'chat_id' in payload && 'text' in payload;
}

export async function reportError(err: BotError<WakatimeContext>) {
  const { error } = err;

  if (error instanceof HttpError) {
    const { statusCode, statusMessage, url } = error;
    await err.ctx.reportError(
      `Failed with status ${statusCode}\nError: ${statusMessage}\nURL: ${url}`,
    );
    return;
  }

  if (isSendErrorPayload(error)) {
    const { chat_id: chatId, text } = error;
    await err.ctx.report(`Cannot send message to ${chatId}, Error: ${escapeHTML(text)}`);
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  await err.ctx.reportError(message);
}
