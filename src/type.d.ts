interface Config {
  reportId: string;
  apiEndpoint: string;
  adventApi: string;
  botToken: string;
  apiKey: string;
  botPort: number;
  apiPort: number;
  leaderboardUrl: string;
  webpageUrl: string;
  dbFilePath: string;
  puppeteerExecPath?: string;
  admin: number;
  adventUrl: string;
  botWebhookUrl?: string;
}

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
  image: string | Buffer;
  caption: string;
}

interface WakatimeUserResponse {
  data: WakatimeDto[];
  modified_at: string;
}

type AdventLeaderboard = AdventUser[];
interface AdventUser {
  name: string;
  score: number;
  stars: { gold: number; silver: number };
}

interface Day {
  get_star_ts: number;
  star_index: number;
}

interface AdventOfCodeResponseUser {
  owner_id?: number;
  completion_day_level: Record<number, Record<number, Day>>;
  global_score: number;
  id: number;
  last_star_ts: number;
  local_score: number;
  name: string | null;
  stars: number;
}

type AdventOfCodeResponse = AdventOfCodeResponseUser[];
