function toUser(wakatimeUser) {
  return {
    rank: wakatimeUser.rank,
    fullname: wakatimeUser.user.display_name,
    username: wakatimeUser.user.username,
    dailyAverage: wakatimeUser.running_total.human_readable_daily_average,
    weekly: wakatimeUser.running_total.human_readable_total,
    avatar: wakatimeUser.user.photo
      ? `${wakatimeUser.user.photo}?s=420`
      : undefined,
    totalStatus: wakatimeUser.running_total.total_status,
    dailyStatus: wakatimeUser.running_total.daily_status,
  };
}

export function getDataFromUrl() {
  const stringifyData = new URLSearchParams(window.location.search).get('data');
  try {
    const wakatimeUsers = JSON.parse(stringifyData);
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
