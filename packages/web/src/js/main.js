const stringifyData = new URLSearchParams(window.location.search).get('Data');
const data = JSON.parse(stringifyData);

const dateTextElement = document.querySelector('.date');

const weekCounter = (DateString) => {
  const date = new Date(DateString);
  const today = new Date();
  return Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
};

const timeCreated = new Date('Monday, 4 January 2021');

dateTextElement.textContent = `${new Date().getFullYear()} - WEEK ${weekCounter(
  timeCreated
)}`;

const winnerBox = document.querySelector('.winner-box');

const convertTextToElement = (StringifyElement) => {
  const Parser = new DOMParser();
  const { firstChild: NewElement } = Parser.parseFromString(
    StringifyElement,
    'text/html'
  ).body;

  return NewElement;
};

const winnerBoxElements = data.map((item, Index) => {
  const ranks = ['1st', '2nd', '3rd'];
  const winnerBoxTemplate = winnerBox.outerHTML;

  const elem = convertTextToElement(winnerBoxTemplate);

  elem.querySelector('.winner-rank').textContent = ranks[Index];

  if (item.user.photo_public) {
    elem.querySelector('.winner-avatar').src = `${item.user.photo}?s=420`;
  }

  elem.querySelector('.user-name').textContent = item.user.display_name;
  elem.querySelector('.user-id').textContent = item.user.username;

  elem
    .querySelectorAll('.user-chart-time')
    .forEach((ChartTimeElem, ChartTimeIndex) => {
      if (ChartTimeIndex === 0) {
        ChartTimeElem.innerHTML =
          item.running_total.human_readable_total +
          document.querySelector('.user-chart-status').outerHTML;
      } else {
        ChartTimeElem.innerHTML =
          item.running_total.human_readable_daily_average +
          document.querySelector('.user-chart-status').outerHTML;
      }

      if (ChartTimeIndex % 2 && item.running_total.daily_status) {
        ChartTimeElem.querySelector('img').src = 'assets/Images/UpIcon.svg';
      } else if (item.running_total.total_status) {
        ChartTimeElem.querySelector('img').src = 'assets/Images/UpIcon.svg';
      }
    });

  return elem;
});

winnerBoxElements.forEach((element) =>
  document.querySelector('.winners').appendChild(element)
);

winnerBox.remove();
