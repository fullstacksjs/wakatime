import { createServer } from './api/createServer.js';
import { createBot } from './bot/createBot.js';
import { getConfig } from './getConfig.js';
import { WakatimeRepo } from './WakatimeRepo.js';

const config = getConfig();

const db = await new WakatimeRepo(config.dbFilePath).init();
const runServer = createServer(config, db);
const bot = createBot(config, db);

runServer();
bot.start();

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
