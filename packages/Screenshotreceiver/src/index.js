const puppeteer = require('puppeteer-core');
const { PUPPETEER_EXECUTABLE_PATH, WEBPAGE_URL } = require('./Config/Config');
const fs = require('fs/promises');
const FetchRankedUsers = require('./Api/FetchRankedUsers');

const InitJsonDB = async (JsonFileName) => {
  const FileExist = fs.readFile(JsonFileName);
  await FileExist.catch(async () => {
    await fs.writeFile(JsonFileName, '[]');
  });
  const DB = await (await fs.readFile(JsonFileName)).toString('utf-8');
  return JSON.parse(DB);
};

const PageQuery = (Url, Query) =>
  `${Url.replace(/\/$/, '')}?Data=${JSON.stringify(Query)}`;

const GetScreenShot = async (Url) => {
  try {
    const browser = await puppeteer.launch({
      executablePath: PUPPETEER_EXECUTABLE_PATH,
    });

    const Page = await browser.newPage();

    await Page.goto(Url);

    await Page.waitForTimeout(2000);

    await Page.setViewport({ width: 815, height: 700, deviceScaleFactor: 2 });

    await Page.screenshot({
      path: 'screenshot.jpg',
      fullPage: true,
    });

    await browser.close();
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

const AllSteps = async () => {
  await InitJsonDB('DB.json');
  const ThreeTopUsers = (await FetchRankedUsers()).slice(0, 3);
  const Url = PageQuery(WEBPAGE_URL, ThreeTopUsers);
  await GetScreenShot(Url);
};
AllSteps();
