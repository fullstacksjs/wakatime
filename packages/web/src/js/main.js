const StringifyData = new URLSearchParams(window.location.search).get('Data');
const Data = JSON.parse(StringifyData);

const DateTextElement = document.getElementById('Date-Text');

const WeekCounter = (DateString) => {
  const date = new Date(DateString);
  const today = new Date();
  return Math.floor((today - date) / (1000 * 60 * 60 * 24 * 7));
};

const TimeCreated = new Date('Monday, 4 January 2021');

DateTextElement.innerHTML = `${new Date().getFullYear()} - WEEK ${WeekCounter(
  TimeCreated
)}`;

const WinnerBox = document.querySelector('.Winner-Box');
const WinnerBoxTemplate = WinnerBox.outerHTML;

const ConvertTextToElement = (StringifyElement) => {
  const Parser = new DOMParser();
  const { firstChild: NewElement } = Parser.parseFromString(
    StringifyElement,
    'text/html'
  ).body;

  return NewElement;
};

const WinnerBoxElements = Data.map((Item, Index) => {
  const Ranks = ['1st', '2nd', '3rd'];
  const Elem = ConvertTextToElement(WinnerBoxTemplate);
  Elem.querySelector('.Winner-Rank').innerHTML = Ranks[Index];

  if (Item.user.photo_public) {
    Elem.querySelector('.Winner-Avatar').src = `${Item.user.photo}?s=420`;
  }

  Elem.querySelector('.User-Name').innerHTML = Item.user.display_name;
  Elem.querySelector('.User-Id').innerHTML = Item.user.username;

  Elem.querySelectorAll('.User-Chart-Time').forEach(
    (ChartTimeElem, ChartTimeIndex) => {
      const Text =
        ChartTimeIndex === 0
          ? ChartTimeElem.innerHTML.replace(
              /Error/,
              Item.running_total.human_readable_daily_average
            )
          : ChartTimeElem.innerHTML.replace(
              /Error/,
              Item.running_total.human_readable_total
            );

      ChartTimeElem.innerHTML = Text;
    }
  );

  return Elem;
});

WinnerBoxElements.forEach((element) =>
  document.querySelector('#Winners').appendChild(element)
);

WinnerBox.remove();
