import cron from 'node-cron';

import { sendDailyReport } from './dailyReportJob.ts';

export const scheduleCronJobs = () => {
  cron.schedule(
    '0 21 * * *',
    () => {
      sendDailyReport().catch(error => {
        console.error(error);
      });
    },
    { timezone: 'UTC' },
  );
};
