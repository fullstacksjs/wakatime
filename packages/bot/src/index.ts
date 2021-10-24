import bot from './Bot.js';
import { helpCommand, listWeekly, startCommand } from './commands/index.js';

bot.start(startCommand);
bot.help(helpCommand);
bot.command('list_weekly', listWeekly);

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
