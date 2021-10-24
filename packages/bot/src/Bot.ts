import { Telegraf } from 'telegraf';

import { WakatimeContext } from './Context';
import { getConfig } from './getConfig';

const config = getConfig();

export default new Telegraf(config.botToken, {
  contextType: WakatimeContext,
  // telegram: {
  //   apiRoot: 'https://tgproxy-m.herokuapp.com/',
  // },
});
