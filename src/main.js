import {showFilters} from './render-filter.js';
import {Point} from './point';
import {EditPoint} from './edit-point';
import {Cost} from './cost';
import {Sort} from './sort';
import {renderChart} from './render-chart';
import {API} from './API.js';

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

const filtersParentElement = document.querySelector(`.trip-filter`);
const pointParentElement = document.querySelector(`.trip-day__items`);
const totalPriceParentElement = document.querySelector(`.trip__total-cost`);
const sortersParentElement = document.querySelector(`.trip-sorting`);
const showPointsButton = document.querySelector(`.view-switch__item--table`);
const showStatsButton = document.querySelector(`.view-switch__item--stats`);
const table = document.getElementById(`table`);
const stats = document.getElementById(`stats`);

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAorrdfbfgrr=`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;
export const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
const costComponent = new Cost();
const sortComponent = new Sort();
sortersParentElement.appendChild(sortComponent.render());

export let destinations = [];
export let offers = [];

const renderPoint = function (data) {
  const pointComponent = new Point(data);
  const editPointComponent = new EditPoint(data);
  pointParentElement.appendChild(pointComponent.render());

  const block = () => {
    const form = editPointComponent.element.querySelector(`.point__form`);
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      elements[i].readOnly = true;
    }
  };

  const unblock = () => {
    const form = editPointComponent.element.querySelector(`.point__form`);
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      elements[i].readOnly = false;
    }
  };

  const replaceComponents = () => {
    editPointComponent.render();
    pointParentElement.replaceChild(editPointComponent.element, pointComponent.element);
    pointComponent.unrender();
  };

  pointComponent.onEdit = () => {
    const destinationsList = api.getDestinations();
    const offersList = api.getOffers();
    destinationsList
      .then((value) => {
        destinations = value;
      })
      .then(
          offersList
        .then((value) => {
          offers = value;
        })
      )
      .then(replaceComponents);
  };

  editPointComponent.onEscape = () => {
    pointComponent.render();
    pointParentElement.replaceChild(pointComponent.element, editPointComponent.element);
    editPointComponent.unrender();
  };

  editPointComponent.onSubmit = (newObject) => {
    data.icon = newObject.icon;
    data.activity = newObject.activity;
    data.city = newObject.city;
    data.time = newObject.time;
    data.price = newObject.price;
    data.offers = newObject.offers;
    data.title = newObject.title;

    costComponent.totalPrice(allEvents);
    costComponent.unrender();
    totalPriceParentElement.innerHTML = ``;
    totalPriceParentElement.appendChild(costComponent.render());

    block();

    api.updatePoints({id: data.id, data: data.toRAW()})
      .then((newPoint) => {
        unblock();
        pointComponent.update(newPoint);
        pointComponent.render();
        pointParentElement.replaceChild(pointComponent.element, editPointComponent.element);
        editPointComponent.unrender();
      })
      .catch(() => {
        editPointComponent.shake();
        unblock();
      });
  };

  editPointComponent.onDelete = ({id}) => {
    block();
    api.deleteTask({id})
      .then(() => api.getPoints())
      .then(() => {
        pointParentElement.removeChild(editPointComponent.element);
        editPointComponent.unrender();
      })
      .catch(() => {
        editPointComponent.shake();
        unblock();
      });
  };
};

const showPoints = function (points) {
  for (let i = 0; i < points.length; i++) {
    renderPoint(points[i]);
  }
};

const filterEvents = (events, filterName) => {
  switch (filterName) {
    default:
      return events;

    case `filter-future`:
      return events.filter((it) => it.time.startTime < Date.now());

    case `filter-past`:
      return events.filter((it) => it.time.startTime > Date.now());
  }
};

filtersParentElement.onchange = (evt) => {
  const filterName = evt.target.id;
  filteredEvents = filterEvents(allEvents, filterName);
  showPoints(filteredEvents);
  renderChart();
};

showStatsButton.addEventListener(`click`, function () {
  showStatsButton.classList.add(`view-switch__item--active`);
  showPointsButton.classList.remove(`view-switch__item--active`);
  table.classList.add(`visually-hidden`);
  stats.classList.remove(`visually-hidden`);
  renderChart();
});

showPointsButton.addEventListener(`click`, function () {
  showPointsButton.classList.add(`view-switch__item--active`);
  showStatsButton.classList.remove(`view-switch__item--active`);
  stats.classList.add(`visually-hidden`);
  table.classList.remove(`visually-hidden`);
});

export const getPrices = () => {
  let ridePrice = 0;
  let stayPrice = 0;
  let drivePrice = 0;
  let eatPrice = 0;
  let lookPrice = 0;
  let flightPrice = 0;

  const filterPrices = (event) => {
    switch (event.title) {
      case `bus`:
      case `ship️`:
      case `taxi`:
      case `train`:
      case `transport`:
        ridePrice += parseInt(event.price, 10);
        break;

      case `flight`:
        flightPrice += parseInt(event.price, 10);
        break;

      case `check-in`:
        stayPrice += parseInt(event.price, 10);
        break;

      case `drive`:
        drivePrice += parseInt(event.price, 10);
        break;

      case `restaurant`:
        eatPrice += parseInt(event.price, 10);
        break;

      case `sightseeing`:
        lookPrice += parseInt(event.price, 10);
        break;
    }
  };

  allEvents.forEach(filterPrices);
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
  allEvents.forEach(filterCounts);
  return [driveCount, rideCount, flightCount, sailCount];
};

const pointsList = api.getPoints();

const showPreloadMessage = (text) => {
  pointParentElement.innerHTML = `<div style="font-weight: 900; font-size: 17px; position: fixed; top: 50%; left: 50%; transform: translateX(-50%)">${text}</div>`;
};

const hidePreloadMessage = () => {
  pointParentElement.innerHTML = ``;
};

const loadText = `Loading route...`;
const errorText = `Something went wrong while loading your route info. Check your connection or try again later`;

let filteredEvents = [];
let allEvents = [];

showPreloadMessage(loadText);

pointsList
  .then((points) => {
    hidePreloadMessage();
    showPoints(points);
    allEvents = points;
    costComponent.totalPrice(points);
    totalPriceParentElement.appendChild(costComponent.render());
  })
  .catch(() => {
    showPreloadMessage(errorText);
  });


showFilters(`filter`, filters);
