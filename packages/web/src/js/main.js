import { getDataFromUrl } from './api.js';
import { createWinnerBoxElement, getDateTitle } from './app.js';

const winners = getDataFromUrl();
const dateElement = document.getElementById('date');
dateElement.textContent = getDateTitle(new Date());

const winnerBoxElement = document.getElementById('winner-box');
const winnerBoxElements = winners.map((winner) =>
  createWinnerBoxElement(winner, 'winner-box')
);

winnerBoxElements.forEach((element) =>
  document.querySelector('.winners').appendChild(element)
);

winnerBoxElement.remove();
