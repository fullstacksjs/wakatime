interface Config {
  botToken: string;
  apiKey: string;
  port: number;
  puppeteerExecutablePath: string;
  leaderboardUrl: string;
  webpageUrl: string;
  leaderboardDbFilePath: string;
  scheduleDbFilePath: string;
  userDbFilePath: string;
}

type Week = string;

interface LanguageReport {
  name: string;
  total_seconds: number;
}

interface WakatimeDto {
  rank: number;
  running_total: {
    daily_average: number;
    total_seconds: number;
    human_readable_daily_average: string;
    human_readable_total: string;
    languages: LanguageReport[];
  };
  user: {
    display_name: string;
    email: string | null;
    full_name: string;
    human_readable_website: string;
    id: string;
    is_email_public: boolean;
    is_hireable: boolean;
    location: string;
    photo: string;
    photo_public: boolean;
    username: string | null;
    website: string;
  };
}

type Day = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Hour = number;
type Minute = number;

type Schedule = [Day, Hour, Minute];
type GroupId = string;

interface LeaderboardDto {
  image: Buffer | string;
  caption: string;
}

interface Container {
  config: Config;
  scheduleRepo: import('./core/repos/ScheduleRepo').ScheduleRepo;
  reportRepo: import('./core/repos/ReportRepo').ReportRepo;
  userRepo: import('./core/repos/UserRepository').UserRepo;
  groupScheduleService: import('./core/Services/ScheduleService').GroupScheduleService;
  leaderboardService: import('./core/Services/LeaderboardService').LeaderboardService;
  puppeteerService: import('./core/Services/PuppeteerService').PuppeteerService;
  wakatimeService: import('./core/Services/WakatimeService').WakatimeService;
  api: import('grammy').Api<import('grammy').RawApi>;
}
