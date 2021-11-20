import { dedent } from 'ts-dedent';

import { getWeekOfYear, secondsToHours } from '../utils/date';
import { medals } from './medals';

export const getReportCaption = (users: ReportAndUser[]) => dedent`
<b>Wakatime Report</b>
<i>${new Date().getFullYear()} - Week ${getWeekOfYear(new Date())} </i>
${users
  .map(
    ({ user }, idx: number) =>
      `${medals[idx]} <b>${user.name}</b>: <i>~${secondsToHours(
        user.lastTotalSeconds ?? 0,
      )}hrs</i>`,
  )
  .join('\n')}

#wakatime_report

@fullstacks
`;
