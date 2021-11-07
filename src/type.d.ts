interface Config {
  botToken: string;
  apiKey: string;
  puppeteerExecutablePath: string;
  leaderboardUrl: string;
  webpageUrl: string;
  dbFilePath: string;
}

type Week = string;

interface WeekReport {
  reports: UserReport[];
}

interface LanguageReport {
  name: string;
  total_seconds: number;
}

interface WakatimeUser {
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

interface User {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  lastTotalSeconds: number | null;
  lastDailyAverage: number | null;
  lastRank: number;
  diff: number;
}

interface UserReport {
  rank: number;
  dailyAverage: number;
  totalSeconds: number;
  userId: string;
}

interface ReportAndUser {
  report: UserReport;
  user: User;
}
