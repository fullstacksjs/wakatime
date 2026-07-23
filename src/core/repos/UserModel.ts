export interface LanguageModel {
  name: string;
  totalSeconds: number;
}

export const sortLanguagesByUsage = (languages: LanguageModel[]): LanguageModel[] => {
  return [...languages].sort(
    (a, b) => b.totalSeconds - a.totalSeconds || a.name.localeCompare(b.name),
  );
};

export interface UserModel {
  id: string;
  name: string;
  avatar: string;
  username: string | null;
  languages: LanguageModel[];
  lastTotalSeconds: number | null;
  lastDailyAverage: number | null;
  lastRank: number;
  diff?: number;
  telegramUsername?: string;
}

export const toLanguageModels = (languages: LanguageReport[]): LanguageModel[] => {
  return sortLanguagesByUsage(
    languages.map(language => ({
      name: language.name,
      totalSeconds: language.total_seconds,
    })),
  );
};

export const toUserModel = (dto: WakatimeDto): UserModel => {
  return {
    id: dto.user.id,
    name: dto.user.display_name,
    avatar: dto.user.photo,
    username: dto.user.username,
    languages: toLanguageModels(dto.running_total.languages),
    lastTotalSeconds: dto.running_total.total_seconds,
    lastDailyAverage: dto.running_total.daily_average,
    lastRank: dto.rank,
  };
};
