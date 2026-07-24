import { InputFile } from 'grammy';

import { container } from '../../config/container.ts';
import { getDailyReport } from '../commands/day.ts';

export async function sendDailyReport() {
  const { config, grammy } = container.cradle;
  const { defaultChatId, defaultTopicId } = config.bot;
  if (!defaultChatId) return;

  const { image, title } = await getDailyReport();

  return grammy.sendPhoto(defaultChatId, new InputFile(image), {
    caption: title,
    message_thread_id: defaultTopicId,
    parse_mode: 'HTML',
  });
}
