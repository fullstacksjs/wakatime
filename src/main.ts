import 'dotenv/config';

if (process.argv[2] === 'api') {
  const { Api } = await import('./api/Api.js');
  const { registerApiContainer } = await import('./config/initContainer.js');
  const container = await registerApiContainer();
  void new Api(container).start();
}

if (process.argv[2] === 'bot') {
  const { BotApi } = await import('./bot/BotApi.js');
  const { registerBotContainer } = await import('./config/initContainer.js');
  const container = await registerBotContainer();
  void new BotApi(container).start();
}
