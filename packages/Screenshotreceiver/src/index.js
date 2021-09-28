const FetchRankedUsers = require('./Api/FetchRankedUsers');
const puppeteer = require('puppeteer-core');
const { PUPPETEER_EXECUTABLE_PATH, WEBPAGE_URL } = require('./Config/Config');

const PageQuery = async () => {
  const ThreeTopUsers = (await FetchRankedUsers()).slice(0, 3);
  return `?Data=${JSON.stringify(ThreeTopUsers)}`;
};

const GetScreenShot = async (Url) => {
  const browser = await puppeteer.launch({
    executablePath: PUPPETEER_EXECUTABLE_PATH,
  });

  const Page = await browser.newPage();

  await Page.goto(`${Url.replace(/\/$/, '')}${await PageQuery()}`);

  await Page.waitForTimeout(2000);

  await Page.setViewport({ width: 815, height: 700, deviceScaleFactor: 2 });

  await Page.screenshot({
    path: 'screenshot.jpg',
    fullPage: true,
  });

  await browser.close();
};

GetScreenShot(WEBPAGE_URL);
