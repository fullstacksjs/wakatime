import { createServer } from './api/createServer.js';
import { createBot } from './bot/createBot.js';
import { getConfig } from './getConfig.js';
import { WakatimeRepo } from './WakatimeRepo.js';

const config = getConfig();

const wakatimeDb = await new WakatimeRepo(config.wakatimeDbFilePath).init();
const runServer = createServer(config, wakatimeDb);
const bot = createBot(config, wakatimeDb);

runServer();
bot.start();

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
