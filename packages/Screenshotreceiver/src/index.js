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

const InsertNewDataToDB = async (JsonFileName, DB, JsonData) => {
  const NewDB = [...DB, JsonData];
  const OptimalDB = NewDB.filter((Value, Index) => {
    if (NewDB.length >= 2) {
      return Index > NewDB.length - 3;
    }
    return true;
  });

  await fs.writeFile(JsonFileName, JSON.stringify(OptimalDB));
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
  const DB = await InitJsonDB('DB.json');
  const AllUsers = await FetchRankedUsers();

  const NewDB = AllUsers.map((User) => ({
    [User.user.id]: {
      daily_average: User.running_total.daily_average,
      total_seconds: User.running_total.total_seconds,
    },
  }));

  await InsertNewDataToDB('DB.json', DB, NewDB);

  const ThreeTopUsers = AllUsers.slice(0, 3);

  const PrevWeek = DB[DB.length - 1];
  const PrevWeekIds = PrevWeek.map((Value) => Object.keys(Value)[0]);

  const ThisWeek = ThreeTopUsers.map((User) => {
    const Id = User.user.id;

    const PrevWeekTopUser = PrevWeek[PrevWeekIds.indexOf(Id)]?.[Id];

    if (!PrevWeekTopUser) {
      return {
        daily_status: false,
        total_status: false,
      };
    }

    return {
      daily_status:
        PrevWeekTopUser.daily_average < User.running_total.daily_average,

      total_status:
        PrevWeekTopUser.total_seconds < User.running_total.total_seconds,
    };
  });

  const Url = PageQuery(
    WEBPAGE_URL,
    ThreeTopUsers.map((User, Index) => ({
      ...User,
      running_total: {
        ...User.running_total,
        ...ThisWeek[Index],
      },
    }))
  );

  await GetScreenShot(Url);
};

AllSteps();
