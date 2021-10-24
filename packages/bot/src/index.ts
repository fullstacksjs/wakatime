import bot from './Bot';
import { helpCommand, listWeekly, startCommand } from './commands';

bot.start(startCommand);
bot.help(helpCommand);
bot.command('list_weekly', listWeekly);

bot.launch();
