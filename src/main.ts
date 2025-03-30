if (process.argv[2] === 'api') {
  const { Api } = await import('./api/Api.ts');
  const { registerApiContainer } = await import('./config/initContainer.ts');
  const container = await registerApiContainer();
  void new Api(container).start();
}

if (process.argv[2] === 'bot') {
  const { BotApi } = await import('./bot/BotApi.ts');
  const { registerBotContainer } = await import('./config/initContainer.ts');
  const container = await registerBotContainer();
  const bot = new BotApi(container);
  if (container.config.bot.webhookUrl) {
    void bot.registerWebhook(container.config.bot.webhookUrl);
  } else {
    void bot.start();
  }
}

export {};
