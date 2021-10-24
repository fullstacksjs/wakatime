import { Telegraf } from 'telegraf';

import { TOKEN } from './env';

export default new Telegraf(TOKEN, {
  telegram: {
    apiRoot: 'https://tgproxy-m.herokuapp.com/',
  },
});
