// @ts-check

const addLeadingZero = (/** @type {number} */ num) => num.toString().padStart(2, '0');
/**
 * @param {number} seconds
 */
function secondsToHM(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
}

/**
 * @param {{ report: { rank: any; dailyAverage: any; totalSeconds: any; }; user: { name: any; username: any; avatar: any; diff: any; }; }} wakatimeUser
 */
export function toUser(wakatimeUser) {
  return {
    rank: wakatimeUser.report.rank,
    fullname: wakatimeUser.user.name,
    username: wakatimeUser.user.username,
    dailyAverage: secondsToHM(wakatimeUser.report.dailyAverage),
    weekly: secondsToHM(wakatimeUser.report.totalSeconds),
    avatar: wakatimeUser.user.avatar ? `${wakatimeUser.user.avatar}?s=420` : undefined,
    diff: wakatimeUser.user.diff,
  };
}
