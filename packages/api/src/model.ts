export type Week = string;

export interface WeekReport {
  reports: UserReport[];
}

interface LanguageReport {
  name: string;
  total_seconds: number;
}

export interface WakatimeUser {
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

export interface User {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  lastTotalSeconds: number | null;
  lastDailyAverage: number | null;
  lastRank: number;
  diff: number;
}

export interface UserReport {
  rank: number;
  dailyAverage: number;
  totalSeconds: number;
  userId: string;
}

export interface ReportAndUser {
  report: UserReport;
  user: User;
}

export const toUser = (wakatimeUser: WakatimeUser): ReportAndUser => ({
  report: {
    rank: wakatimeUser.rank,
    dailyAverage: wakatimeUser.running_total.daily_average,
    totalSeconds: wakatimeUser.running_total.total_seconds,
    userId: wakatimeUser.user.id,
  },
  user: {
    id: wakatimeUser.user.id,
    name: wakatimeUser.user.display_name,
    avatar: wakatimeUser.user.photo,
    username: wakatimeUser.user.username,
    lastTotalSeconds: wakatimeUser.running_total.total_seconds,
    lastDailyAverage: wakatimeUser.running_total.daily_average,
    lastRank: wakatimeUser.rank,
    diff: 0,
  },
});
