interface Config {
  botToken: string;
  apiKey: string;
  port: number;
  puppeteerExecutablePath: string;
  leaderboardUrl: string;
  webpageUrl: string;
  wakatimeDbFilePath: string;
  scheduleDbFilePath: string;
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

interface Leaderboard {
  image: Buffer | string;
  caption: string;
}
