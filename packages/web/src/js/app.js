import { formatOrdinals } from './ordinal.js';

export const getDateTitle = date => `${date.getFullYear()} - WEEK ${getWeekOfYear(date)}`;

export function getWeekOfYear(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const millisecondsInDay = 24 * 60 * 60 * 1000;
  return Math.ceil(((date - oneJan.valueOf()) / millisecondsInDay + oneJan.getDay() + 1) / 7);
}

const getStatusIcon = status => `assets/images/${status >= 0 ? 'UpIcon.svg' : 'DownIcon.svg'}`;

export function createWinnerBoxElement(winner, templateId) {
  const winnerBoxTemplate = document.getElementById(templateId);
  const winnerElement = winnerBoxTemplate.cloneNode(true);

  winnerElement.querySelector('[data-rank]').textContent = formatOrdinals(winner.rank);

  if (winner.avatar != null) {
    winnerElement.querySelector('[data-avatar]').src = winner.avatar;
  }

  winnerElement.querySelector('[data-fullname]').textContent = winner.fullname;
  winnerElement.querySelector('[data-username]').textContent = winner.username;

  const totalStatusElement = winnerElement.querySelector('[data-total]');
  totalStatusElement.textContent = winner.weekly;

  const totalStatusElementStatus = winnerElement.querySelector('[data-total-status]');
  totalStatusElementStatus.src = getStatusIcon(winner.diff);

  const todayStatusElement = winnerElement.querySelector('[data-daily]');
  todayStatusElement.textContent = winner.dailyAverage;

  const todayStatusElementStatus = winnerElement.querySelector('[data-daily-status]');
  todayStatusElementStatus.src = getStatusIcon(winner.diff);

  return winnerElement;
}
