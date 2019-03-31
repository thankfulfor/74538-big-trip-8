import {getRandomNumber} from './utils';
import renderFilter from './render-filter.js';
import {getPoints} from './mocks';
import {Point} from './point';
import {EditPoint} from './edit-point';
import {renderChart} from './render-chart';

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

const renderPoint = function (data) {
  const pointComponent = new Point(data);
  if (!pointComponent._isDeleted) {
    pointParentElement.appendChild(pointComponent.render());
  }
  const editPointComponent = new EditPoint(data);

  pointComponent.onEdit = () => {
    editPointComponent.render();
    pointParentElement.replaceChild(editPointComponent.element, pointComponent.element);
    pointComponent.unrender();
  };

  editPointComponent.onSubmit = (newObject) => {
    data.icon = newObject.icon;
    data.activity = newObject.activity;
    data.city = newObject.city;
    data.time = newObject.time;
    data.price = newObject.price;
    data.offers = newObject.offers;
    pointComponent.update(data);
    pointComponent.render();
    pointParentElement.replaceChild(pointComponent.element, editPointComponent.element);
    editPointComponent.unrender();
  };

  editPointComponent.onDelete = () => {
    data.isDeleted = true;
    pointParentElement.removeChild(editPointComponent.element);
    editPointComponent.unrender();
  };
};

export const pointsList = getPoints();

const showPoints = function (points) {
  for (let i = 0; i < points.length; i++) {
    renderPoint(points[i]);
  }
};

const filterEvents = (event, filterName) => {
  switch (filterName) {
    default:
      return pointsList;

    case `filter-future`:
      return pointsList.filter((it) => it.date < Date.now());

    case `filter-past`:
      return pointsList.filter((it) => it.date > Date.now());
  }
};

filtersParentElement.onchange = (evt) => {
  const filterName = evt.target.id;
  const filteredEvents = filterEvents(pointsList, filterName);
  showPoints(filteredEvents);
};

const showPointsButton = document.querySelector(`.view-switch__item--table`);
const showStatsButton = document.querySelector(`.view-switch__item--stats`);
const points = document.getElementById(`table`);
const stats = document.getElementById(`stats`);

showStatsButton.addEventListener(`click`, function () {
  showStatsButton.classList.add(`view-switch__item--active`);
  showPointsButton.classList.remove(`view-switch__item--active`);
  points.classList.add(`visually-hidden`);
  stats.classList.remove(`visually-hidden`);
  renderChart();
});

showPointsButton.addEventListener(`click`, function () {
  showPointsButton.classList.add(`view-switch__item--active`);
  showStatsButton.classList.remove(`view-switch__item--active`);
  stats.classList.add(`visually-hidden`);
  points.classList.remove(`visually-hidden`);
});

export const getPrices = () => {
  let ridePrice = 0;
  let stayPrice = 0;
  let drivePrice = 0;
  let eatPrice = 0;
  let lookPrice = 0;
  let flightPrice = 0;

  const filterPrices = (point) => {
    switch (point.activity) {
      case `Bus to `:
      case `Ship to ️`:
      case `Taxi to `:
      case `Train to `:
      case `Transport to `:
        ridePrice += point.price;
        break;

      case `️Flight to `:
        flightPrice += point.price;
        break;

      case `Check into hotel at `:
        stayPrice += point.price;
        break;

      case `Drive to `:
        drivePrice += point.price;
        break;

      case `Restaurant at `:
        eatPrice += point.price;
        break;

      case `️Sightseeing at `:
        lookPrice += point.price;
        break;
    }
  };

  pointsList.forEach(filterPrices);
  return [flightPrice, stayPrice, drivePrice, lookPrice, eatPrice, ridePrice];
};

export const getTransportWays = () => {
  let rideCount = 0;
  let driveCount = 0;
  let flightCount = 0;
  let sailCount = 0;

  const filterCounts = (point) => {
    switch (point.activity) {
      case `Bus to `:
      case `Taxi to `:
      case `Train to `:
      case `Transport to `:
        rideCount += 1;
        break;

      case `️Flight to `:
        flightCount += 1;
        break;

      case `Drive to `:
        driveCount += 1;
        break;

      case `Ship to ️`:
        sailCount += 1;
        break;
    }
  };

  pointsList.forEach(filterCounts);
  return [driveCount, rideCount, flightCount, sailCount];
};

showFilters(filtersParentElement, `filter`, filters);
showFilters(sortersParentElement, `sorting`, sorters);
showPoints(pointsList);
showPointsByClick();
