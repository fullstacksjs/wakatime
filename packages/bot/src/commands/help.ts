import { Context } from 'telegraf';

export const helpCpmmand = (ctx: Context) => {
  const text = `
    You can control me by sending these commands:
    /help - to see this help.
    /list_weekly - see list of best coder during current week
  
  
  
    Report <b>Bugs</b>: @Hoseinprd
    `;
  ctx.reply(text, {
    parse_mode: 'HTML',
  });
};
