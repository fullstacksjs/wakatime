import bot from './Bot';
import { helpCpmmand, listWeekly, startCommand } from './commands';

bot.start(startCommand);
bot.help(helpCpmmand);
bot.command('list_weekly', listWeekly);

bot.launch();
