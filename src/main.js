import {getRandomNumber} from './utils';
import renderFilter from './renderFilter.js';
import {getPointData} from './mocks';
import renderPoint from './renderPoint.js';

const TEMPLATE_POINTS_QUANTITY = 7;

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

const filtersParentElement = document.querySelector(`.trip-filter`);
const sortersParentElement = document.querySelector(`.trip-sorting`);
const pointParentElement = document.querySelector(`.trip-day__items`);

const filterInputChangeHandler = function () {
  pointParentElement.innerHTML = ``;
  showPoints(getRandomNumber());
};

const showPointsByClick = function () {
  const filterInputElements = filtersParentElement.querySelectorAll(`[name=filter]`);
  filterInputElements.forEach(function (filterInputElement) {
    filterInputElement.addEventListener(`change`, filterInputChangeHandler);
  });
};

const showFilters = function (parentElement, filterType, filtersArray) {
  const filterList = filtersArray.map((filtersItem) => {
    return renderFilter(filterType, filtersItem.name, filtersItem.checked);
  });
  parentElement.insertAdjacentHTML(`afterbegin`, filterList.join(``));
};


const showPoints = function (cardsQuantity) {
  let filterList = ``;
  for (let i = 0; i < cardsQuantity; i++) {
    filterList += renderPoint(getPointData());
  }
  pointParentElement.innerHTML = filterList;
};

showFilters(filtersParentElement, `filter`, filters);
showFilters(sortersParentElement, `sorting`, sorters);
showPoints(TEMPLATE_POINTS_QUANTITY);
showPointsByClick();
