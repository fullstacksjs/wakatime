import type { BotError, NextFunction } from 'grammy';

import { isObject } from '@fullstacksjs/toolbox';
import { GrammyError } from 'grammy';

interface SendErrorPayload {
  chat_id: number;
  text: string;
}

function isSendErrorPayload(payload: unknown): payload is SendErrorPayload {
  return isObject(payload) && 'chat_id' in payload && 'text' in payload;
}

export async function boundaryHandler(err: BotError, next: NextFunction) {
  const { error } = err;

  if (!(error instanceof GrammyError) || !isSendErrorPayload(error.payload)) {
    return next();
  }

  const chatId = error.payload.chat_id;
  const errorText = error.payload.text;
  console.error(`Cannot send message to ${chatId}, Error: ${errorText}`);
}
