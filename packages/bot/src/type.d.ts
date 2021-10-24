interface WakaTimeAPI {
  current_user: CurrentUser;
  data: DataEntity[] | [];
  language?: null;
  modified_at: string;
  page: number;
  range: Range;
  timeout: number;
  total_pages: number;
  writes_only: boolean;
}
interface CurrentUser {
  rank: number;
  running_total: RunningTotal;
  user: User;
}
interface RunningTotal {
  daily_average: number;
  human_readable_daily_average: string;
  human_readable_total: string;
  languages: LanguagesEntity[] | [];
  modified_at: string;
  total_seconds: number;
}

interface LanguagesEntity {
  name: string;
  total_seconds: number;
}
interface User {
  full_name: string;
  human_readable_website: string;
  id: string;
  is_hireable: boolean;
  location: string;
  photo: string;
  username: string;
  website: string;
}
interface DataEntity {
  rank: number;
  running_total: RunningTotal;
  user: User;
}

interface Range {
  end_date: string;
  end_text: string;
  name: string;
  start_date: string;
  start_text: string;
  text: string;
}
