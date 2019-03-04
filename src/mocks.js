import {getRandomNumber} from './utils';

const MILLISECONDS_IN_TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const DAYS_IN_WEEK = 7;
const DESCRIPTION_MAX_QUANTITY = 3;
const OFFER_MAX_QUANTITY = 3;
export const PRICE_MAX_QUANTITY = 1000;

const events = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`,
  `Check-in`,
  `Sightseeing`,
  `Restaurant`,
];

const icons = {
  'Taxi': `🚕`,
  'Bus': `🚌`,
  'Train': `🚂`,
  'Ship': `🛳️`,
  'Transport': `🚊`,
  'Drive': `🚗`,
  'Flight': `✈️`,
  'Check-in': `🏨`,
  'Sightseeing': `🏛️`,
  'Restaurant': `🍴`,
};

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

const activities = {
  'Taxi': `Taxi to `,
  'Bus': `Bus to `,
  'Train': `Train to `,
  'Ship': `Ship to ️`,
  'Transport': `Transport to `,
  'Drive': `Drive to `,
  'Flight': `️Flight to `,
  'Check-in': `Check into hotel at `,
  'Sightseeing': `️Sightseeing at `,
  'Restaurant': `Restaurant at `,
};

const placeholderTexts = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non
porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.
In rutrum ac purus sit amet tempus.`.split(`. `);

const getFormatedTime = (miliseconds) => {
  return new Date(miliseconds).toLocaleString(`en-US`, {
    hour: `numeric`,
    minute: `numeric`,
    hour12: false
  });
};

export const getPointData = () => ({
  randomEvent: events[getRandomNumber(events.length)],
  get icon() {
    return icons[this.randomEvent];
  },
  get title() {
    return activities[this.randomEvent];
  },
  city: Array.from(cities)[getRandomNumber(cities.size)],
  picture: `http://picsum.photos/100/100?r=${Math.random()}`,
  get descriptions() {
    let statements = ``;
    for (let i = 0; i <= getRandomNumber(DESCRIPTION_MAX_QUANTITY); i++) {
      statements += placeholderTexts[i] + `. `;
    }
    return statements.trim();
  },
  date: new Date(Date.now() + getRandomNumber(DAYS_IN_WEEK) * MILLISECONDS_IN_TWENTY_FOUR_HOURS),
  get time() {
    const randomTimeFrom = Date.now() + Math.round(getRandomNumber(MILLISECONDS_IN_TWENTY_FOUR_HOURS));
    const randomTimeTo = randomTimeFrom + Math.round(getRandomNumber(MILLISECONDS_IN_TWENTY_FOUR_HOURS));
    const duration = Math.round((randomTimeTo - randomTimeFrom) / MILLISECONDS_IN_HOUR);
    const randomTimeFromFormatted = getFormatedTime(randomTimeFrom);
    const randomTimeToFormatted = getFormatedTime(randomTimeTo);
    const durationFormatted = getFormatedTime(duration);
    return {randomTimeFromFormatted, randomTimeToFormatted, durationFormatted};
  },
  get price() {
    return getRandomNumber(PRICE_MAX_QUANTITY);
  },
  get offers() {
    const randomOffersSet = new Set();
    for (let i = 0; i < getRandomNumber(OFFER_MAX_QUANTITY); i++) {
      randomOffersSet.add(Array.from(offers)[getRandomNumber(offers.size)]);
    }
    return randomOffersSet;
  },
});
