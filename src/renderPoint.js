import {getRandomNumber} from './utils';

const OFFER_PRICE_MAX_QUANTITY = 500;

const renderListItem = function (offers) {
  const randomPrice = getRandomNumber(OFFER_PRICE_MAX_QUANTITY);
  const offersList = Array.from(offers).map((offer) => {
    return `<li><button class="trip-point__offer">${offer} +&euro;&nbsp;${randomPrice}</button></li>`;
  });

  return offersList.join(``);
};


export default function (data) {
  return (
    `<article class="trip-point">
      <i class="trip-icon">${data.icon}</i>
      <h3 class="trip-point__title">${data.title + data.city}</h3>
      <p class="trip-point__schedule">
        <span class="trip-point__timetable">${data.pointTime}</span>
        <span class="trip-point__duration">${data.duration}</span>
      </p>
      <p class="trip-point__price">&euro;&nbsp;${data.pointPrice}</p>
      <ul class="trip-point__offers">
        ${renderListItem(data.offers)}
      </ul>
    </article>`
  );
}
