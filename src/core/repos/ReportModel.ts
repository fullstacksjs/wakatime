import type { UsageModel } from './UsageModel.ts';

import { toUsageModel } from './UsageModel.ts';

export interface ReportModel {
  date: Date;
  usages: UsageModel[];
}

export const toReportModel = (dto: WakatimeUserResponse): ReportModel => {
  return {
    date: new Date(dto.modified_at),
    usages: dto.data.map(toUsageModel),
  };
};
