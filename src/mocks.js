import {getRandomNumber} from './utils';
import moment from 'moment';

const MILLISECONDS_IN_TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const MILLISECONDS_IN_3_HOURS = 3 * 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const DESCRIPTION_MAX_QUANTITY = 3;
const OFFER_MAX_QUANTITY = 3;
export const PRICE_MAX_QUANTITY = 1000;

const TEMPLATE_POINTS_QUANTITY = 7;

const events = [
  {
    title: `Bus`,
    activity: `Bus to `,
    icon: `🚌`,
  },
  {
    title: `Check-in`,
    activity: `Check into hotel at `,
    icon: `🏨`,
  },
  {
    title: `Drive`,
    activity: `Drive to `,
    icon: `🚗`,
  },
  {
    title: `Flight`,
    activity: `️Flight to `,
    icon: `✈️`,
  },
  {
    title: `Restaurant`,
    activity: `Restaurant at `,
    icon: `🍴`,
  },
  {
    title: `Ship`,
    activity: `Ship to ️`,
    icon: `🛳️`,
  },
  {
    title: `Sightseeing`,
    activity: `️Sightseeing at `,
    icon: `🏛️`,
  },
  {
    title: `Taxi`,
    activity: `Taxi to `,
    icon: `🚕`,
  },
  {
    title: `Train`,
    activity: `Train to `,
    icon: `🚂`,
  },
  {
    title: `Transport`,
    activity: `Transport to `,
    icon: `🚊`,
  }
];

const cities = new Set([
  `Abidjan`,
  `Abuja`,
  `Accra`,
  `Addis Ababa`,
  `Alexandria`,
  `Algiers`,
  `Antananarivo`,
  `Bamako`,
  `Benin_City`,
  `Brazzaville`,
  `Cairo`,
  `Cape Town`,
  `Casablanca`,
  `Conakry`,
  `Dakar`,
  `Dar es Salaam`,
  `Douala`,
  `Durban`,
  `Freetown`,
  `Harare`,
  `Huambo`,
  `Ibadan`,
  `Johannesburg`,
  `Kaduna`,
  `Kampala`,
  `Kananga`,
  `Kano`,
  `Kigali`,
  `Kisangani`,
  `Kumasi`,
  `Lagos`,
  `Luanda`,
  `Lubumbashi`,
  `Lusaka`,
  `Maputo`,
  `Marrakech`,
  `Mbuji-Mayi`,
  `Mogadishu`,
  `Mombasa`,
  `Monrovia`,
  `Nairobi`,
  `Ndjamena`,
  `Niamey`,
  `Omdurman`,
  `Onitsha`,
  `Ouagadougou`,
  `Port Elizabeth`,
  `Port Harcourt`,
  `Pretoria`,
  `Rabat`,
  `Tripoli`,
  `Tunis`,
  `Vereeniging`,
]);

const offers = new Set([
  `Add luggage`,
  `Switch to comfort class`,
  `Add meal`,
  `Choose seats`,
]);

const placeholderTexts = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non
porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.
In rutrum ac purus sit amet tempus.`.split(`. `);

const getRandomEvent = () => {
  return events[getRandomNumber(events.length)];
};

const getDescriptions = () => {
  let statements = ``;
  for (let i = 0; i <= getRandomNumber(DESCRIPTION_MAX_QUANTITY); i++) {
    statements += placeholderTexts[i] + `. `;
  }
  return statements.trim();
};

const getTime = () => {
  const startTimeMS = Date.now() + Math.floor(getRandomNumber(MILLISECONDS_IN_TWENTY_FOUR_HOURS));
  const endTimeMS = startTimeMS + Math.round(getRandomNumber(MILLISECONDS_IN_TWENTY_FOUR_HOURS));
  const durationMS = (moment(endTimeMS).diff(moment(startTimeMS), `milliseconds`)) - MILLISECONDS_IN_3_HOURS;
  const endTime = moment(endTimeMS).format(`H:mm`);
  const startTime = moment(startTimeMS).format(`H:mm`);
  const duration = moment(durationMS).format(`H:mm`);
  return {startTime, endTime, duration};
};

const getOffers = () => {
  const randomOffersSet = new Set();
  for (let i = 0; i < getRandomNumber(OFFER_MAX_QUANTITY); i++) {
    randomOffersSet.add(Array.from(offers)[getRandomNumber(offers.size)]);
  }
  return randomOffersSet;
};

const getPointData = () => {
  const randomEvent = getRandomEvent();
  const randomPrice = getRandomNumber(PRICE_MAX_QUANTITY);
  const randomTime = getTime();
  const randomOffers = getOffers();
  return ({
    icon: randomEvent.icon,
    title: randomEvent.title,
    activity: randomEvent.activity,
    city: Array.from(cities)[getRandomNumber(cities.size)],
    picture: `http://picsum.photos/100/100?r=${Math.random()}`,
    descriptions: getDescriptions(),
    date: new Date(Date.now() + getRandomNumber(DAYS_IN_WEEK) * MILLISECONDS_IN_TWENTY_FOUR_HOURS),
    time: randomTime,
    price: randomPrice,
    offers: randomOffers,
  });
};


export const getPoints = function () {
  const points = [];
  for (let i = 0; i < TEMPLATE_POINTS_QUANTITY; i++) {
    points.push(getPointData());
  }
  return points;
};
