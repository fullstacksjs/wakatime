import 'dotenv/config';

import { Api } from './api/Api.js';
import { initContainer } from './config/initContainer.js';
import { BotApi } from './bot/BotApi.js';

const container = await initContainer();

if (process.argv[2] === 'api') void new Api(container).start();
if (process.argv[2] === 'bot') void new BotApi(container).start();
