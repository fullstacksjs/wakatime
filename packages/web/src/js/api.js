// @ts-check

const addLeadingZero = num => num.toString().padStart(2, '0');
function secondsToHM(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
}

/** @param {import('../../../screenshot-receiver/src/model').ReportAndUser} wakatimeUser */
function toUser(wakatimeUser) {
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

export function getDataFromUrl() {
  const rawData = new URLSearchParams(window.location.search).get('users');
  try {
    const wakatimeUsers = JSON.parse(rawData);
    console.log(wakatimeUsers);
    const winners = wakatimeUsers.map(toUser);
    return winners;
  } catch (e) {
    console.error(e);
    return [
      {
        rank: 0,
        username: 'Invalid JSON',
        fullname: 'Invalid JSON',
        today: 'Invalid JSON',
        weekly: 'Invalid JSON',
        avatar: 'Invalid JSON',
      },
    ];
  }
}
