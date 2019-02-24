import renderFilter from '../src/renderFilter.js';
import renderPoint from '../src/renderPoint.js';

const TEMPLATE_POINTS_QUANTITY = 7;
const MAX_POINTS_QUANTITY = 20;

const filters = [
  {
    checked: true,
    name: `Everything`,
  },
  {
    checked: false,
    name: `Future`,
  },
  {
    checked: false,
    name: `Past`,
  }
];

const sorters = [
  {
    checked: true,
    name: `Event`,
  },
  {
    checked: false,
    name: `Time`,
  },
  {
    checked: false,
    name: `Price`,
  }
];

const points = {
  icon: `✈️`,
  title: `Flight to Geneva`,
  timetable: `10:00&nbsp;&mdash; 11:00`,
  duration: `1h 30m`,
  price: `&euro;&nbsp;20`,
  offers: [
    `Upgrade to business +&euro;&nbsp;20`,
    `Select meal +&euro;&nbsp;20`
  ]
};

const getRandomNumber = function () {
  return Math.floor(Math.random() * Math.floor(MAX_POINTS_QUANTITY));
};

const filtersParentElement = document.querySelector(`.trip-filter`);
const sortersParentElement = document.querySelector(`.trip-sorting`);
const pointParentElement = document.querySelector(`.trip-day__items`);

const filterInputChangeHandler = function () {
  pointParentElement.innerHTML = ``;
  showPoints(getRandomNumber());
};

const showPointsByClick = function () {
  const filterInputElements = filtersParentElement.querySelectorAll(`[name=filter]`);
  for (let i = 0; i < filterInputElements.length; i++) {
    filterInputElements[i].addEventListener(`change`, filterInputChangeHandler);
  }
};

const showFilters = function (parentElement, filterType, filtersArray) {
  let filterList = ``;
  for (let i = 0; i < filtersArray.length; i++) {
    filterList += renderFilter(filterType, filtersArray[i].name, filtersArray[i].checked);
  }
  // Используется insertAdjacentHTML вместо innerHTML потому,
  // что в верстке родителя .trip-sorting последним стоит span
  parentElement.insertAdjacentHTML(`afterbegin`, filterList);
};

const showPoints = function (cardsQuantity) {
  let filterList = ``;
  for (let i = 0; i < cardsQuantity; i++) {
    filterList += renderPoint(points.icon, points.title, points.timetable, points.duration, points.price, points.offers);
  }
  pointParentElement.innerHTML = filterList;
};

showFilters(filtersParentElement, `filter`, filters);
showFilters(sortersParentElement, `sorting`, sorters);
showPoints(TEMPLATE_POINTS_QUANTITY);
showPointsByClick();
