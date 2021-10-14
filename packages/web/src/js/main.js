const stringifyData = new URLSearchParams(window.location.search).get('Data');
const data = JSON.parse(stringifyData);

const dateTextElement = document.querySelector('.Date-Text');

const weekCounter = (DateString) => {
  const date = new Date(DateString);
  const today = new Date();
  return Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
};

const timeCreated = new Date('Monday, 4 January 2021');

dateTextElement.textContent = `${new Date().getFullYear()} - WEEK ${weekCounter(
  timeCreated
)}`;

const winnerBox = document.querySelector('.Winner-Box');

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

  elem.querySelector('.Winner-Rank').textContent = ranks[Index];

  if (item.user.photo_public) {
    elem.querySelector('.Winner-Avatar').src = `${item.user.photo}?s=420`;
  }

  elem.querySelector('.User-Name').textContent = item.user.display_name;
  elem.querySelector('.User-Id').textContent = item.user.username;

  elem
    .querySelectorAll('.User-Chart-Time')
    .forEach((ChartTimeElem, ChartTimeIndex) => {
      if (ChartTimeIndex === 0) {
        ChartTimeElem.textContent = item.running_total.human_readable_total;
      } else {
        ChartTimeElem.textContent =
          item.running_total.human_readable_daily_average;
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
  document.querySelector('.Winners').appendChild(element)
);

winnerBox.remove();
