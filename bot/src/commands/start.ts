import { Context } from 'telegraf';

export const startCommand = async (ctx: Context) => {
  const welcome = `👋 Hello, Welcome <b>${ctx.from?.first_name}</b>!\n🎯 This bot will give you latest stats of wakatime per weeks.\nPress /help to get the list of available commands.`;

  ctx.reply(welcome, {
    parse_mode: 'HTML',
  });
};
