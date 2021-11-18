export function getWeekOfYear(date: Date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return Math.ceil(
    ((date.valueOf() - oneJan.valueOf()) / millisecondsInDay + oneJan.getDay() + 1) / 7,
  );
}

export function secondsToHours(sec: number) {
  return Math.floor(sec / 3600);
}
