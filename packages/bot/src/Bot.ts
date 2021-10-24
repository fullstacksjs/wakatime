import { Telegraf } from 'telegraf';

import { WakatimeContext } from './Context.js';
import { getConfig } from './getConfig.js';

const config = getConfig();

export default new Telegraf(config.botToken, {
  contextType: WakatimeContext,
  // telegram: {
  //   apiRoot: 'https://tgproxy-m.herokuapp.com/',
  // },
});
