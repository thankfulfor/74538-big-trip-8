import {showFilters} from './render-filter';
import {Point} from './point';
import {EditPoint} from './edit-point';
import {NewPoint} from './new-point';
import {Cost} from './cost';
import {Sort} from './sort';
import {renderChart} from './render-chart';
import {Api} from './api';
import {events} from './render-events';
import moment from 'moment';

const AUTHORIZATION = `Basic dXcjhjuhggkjhkkYNz9yZAorrdfmbfgrr=30`;
const END_POINT = `https://es8-demo-srv.appspot.com/big-trip`;

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
const addNewEventButton = document.querySelector(`.trip-controls__new-event`);
const table = document.querySelector(`#table`);
const stats = document.querySelector(`#stats`);

const api = new Api({endPoint: END_POINT, authorization: AUTHORIZATION});
const costComponent = new Cost();
const sortComponent = new Sort();
sortersParentElement.appendChild(sortComponent.render());
const destinationsList = api.getDestinations();
export let destinations = [];
export let offers = [];

destinationsList
  .then((value) => {
    destinations = value;
  });

const toggleReadonly = (component, isReadOnly) => {
  const form = component.element.querySelector(`.point__form`);
  const elements = form.elements;
  [...elements].forEach((element) => (element.readOnly = isReadOnly));
};

const escapeHandler = (openComponent, closeComponent) => {
  openComponent.render();
  pointParentElement.replaceChild(openComponent.element, closeComponent.element);
  closeComponent.unrender();
};

const renderPoint = function (data) {
  const pointComponent = new Point(data);
  const editPointComponent = new EditPoint(data);
  pointParentElement.appendChild(pointComponent.render());

  const replaceComponents = () => {
    editPointComponent.render();
    pointParentElement.replaceChild(editPointComponent.element, pointComponent.element);
    pointComponent.unrender();
  };

  pointComponent.onEdit = () => {
    const offersList = api.getOffers();

    offersList
      .then((value) => {
        offers = value;
      })
      .then(replaceComponents);
  };

  editPointComponent.onEscape = () => {
    escapeHandler(pointComponent, editPointComponent);
  };

  editPointComponent.onSubmit = (newObject) => {
    data.icon = newObject.icon;
    data.activity = newObject.activity;
    data.city = newObject.city;
    data.time = newObject.time;
    data.price = newObject.price;
    data.offers = newObject.offers;
    data.title = newObject.title;
    data.isFavorite = newObject.isFavorite;
    costComponent.totalPrice(allEvents);
    costComponent.unrender();
    totalPriceParentElement.innerHTML = ``;
    totalPriceParentElement.appendChild(costComponent.render());

    toggleReadonly(editPointComponent, true);

    api.updatePoints({id: data.id, data: data.toRAW()})
      .then((newPoint) => {
        toggleReadonly(editPointComponent, false);
        pointComponent.update(newPoint);
        pointComponent.render();
        pointParentElement.replaceChild(pointComponent.element, editPointComponent.element);
        editPointComponent.unrender();
      })
      .then(() => api.getPoints())
      .then((points) => {
        allEvents = points;
      })
      .catch(() => {
        editPointComponent.shake();
        toggleReadonly(editPointComponent, false);
      });
  };

  editPointComponent.onDelete = ({id}) => {
    toggleReadonly(editPointComponent, true);

    api.deleteTask({id})
      .then(() => api.getPoints())
      .then((points) => {
        allEvents = points;
        pointParentElement.removeChild(editPointComponent.element);
        editPointComponent.unrender();
      })
      .catch(() => {
        editPointComponent.shake();
        toggleReadonly(editPointComponent, false);
      });
  };
};

const showPoints = function (points) {
  for (let i = 0; i < points.length; i++) {
    renderPoint(points[i]);
  }
};

const addNewEvent = () => {
  addNewEventButton.addEventListener(`click`, function () {
    const newPointComponent = new NewPoint();
    const element = newPointComponent.render();
    pointParentElement.insertAdjacentElement(`afterbegin`, element);

    newPointComponent.onEscape = () => {
      pointParentElement.removeChild(newPointComponent.element);
      newPointComponent.unrender();
    };

    newPointComponent.onSubmit = (newData) => {
      costComponent.totalPrice(allEvents);
      costComponent.unrender();
      totalPriceParentElement.innerHTML = ``;
      totalPriceParentElement.appendChild(costComponent.render());
      toggleReadonly(newPointComponent, true);

      api.addPoint(newData.toRAW())
        .then(() => {
          toggleReadonly(newPointComponent, false);
        })
        .then(() => api.getPoints())
        .then((newPoints) => {
          pointParentElement.innerHTML = ``;
          showPoints(newPoints);
        })
        .catch(() => {
          newPointComponent.shake();
          toggleReadonly(newPointComponent, false);
        });
    };
  });
};

const filterEvents = (points, filterName) => {
  switch (filterName) {
    default:
      return points;

    case `filter-future`:
      return points.filter((it) => it.time.startTime < Date.now());

    case `filter-past`:
      return points.filter((it) => it.time.startTime > Date.now());
  }
};

filtersParentElement.addEventListener(`change`, (evt) => {
  const filterName = evt.target.id;
  filteredEvents = filterEvents(allEvents, filterName);
  pointParentElement.innerHTML = ``;
  showPoints(filteredEvents);
  renderChart();
});

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
    switch (point.title) {
      case `bus`:
      case `taxi`:
      case `train`:
      case `transport`:
        rideCount += 1;
        break;

      case `flight`:
        flightCount += 1;
        break;

      case `drive`:
        driveCount += 1;
        break;

      case `ship`:
        sailCount += 1;
        break;
    }
  };
  allEvents.forEach(filterCounts);
  return [driveCount, rideCount, flightCount, sailCount];
};

export const getTimeSpentChartData = () => {
  const objectData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  };

  const getLabelAndData = (event) => {
    objectData.labels.push(events[event.title].icon + ` ` + events[event.title].activity + event.city);
    objectData.datasets[0].data.push(Math.ceil(moment(event.time.endTime).diff(moment(event.time.startTime), `hours`, true)));
  };

  allEvents.forEach(getLabelAndData);
  return objectData;
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

sortComponent.onSort = (eventTarget) => {

  if (eventTarget === `EVENT`) {
    pointParentElement.innerHTML = ``;
    showPoints(allEvents);
  }

  if (eventTarget === `TIME`) {
    let eventsSortedByTime = [];
    const sortByTime = (eventsArray) => {
      // копируем массив allEvents не по ссылке, а по значению.
      eventsSortedByTime = eventsArray.slice();
      const compareTime = (a, b) => {
        const durationOfA = a.time.startTime - a.time.endTime;
        const durationOfB = b.time.startTime - b.time.endTime;
        return durationOfA > durationOfB ? 1 : -1;
      };

      eventsSortedByTime = eventsSortedByTime.sort(compareTime);
      return eventsSortedByTime;
    };
    pointParentElement.innerHTML = ``;
    showPoints(sortByTime(allEvents));
  }

  if (eventTarget === `PRICE`) {
    let eventsSortedByPrice = [];
    const sortByPrice = (eventsArray) => {
      // копируем массив allEvents не по ссылке, а по значению.
      eventsSortedByPrice = eventsArray.slice();
      const compareTime = (a, b) => {
        return b.price > a.price ? 1 : -1;
      };

      eventsSortedByPrice = eventsSortedByPrice.sort(compareTime);
      return eventsSortedByPrice;
    };
    pointParentElement.innerHTML = ``;
    showPoints(sortByPrice(allEvents));
  }
};

pointsList
  .then((points) => {
    hidePreloadMessage();
    showPoints(points);
    allEvents = points;
    costComponent.totalPrice(points);
    addNewEvent();
    totalPriceParentElement.appendChild(costComponent.render());
  })
  .catch(() => {
    showPreloadMessage(errorText);
  });

filtersParentElement.innerHTML = showFilters(`filter`, filters);
