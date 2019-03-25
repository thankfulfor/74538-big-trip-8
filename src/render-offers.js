import {getRandomNumber} from './utils';
const OFFER_PRICE_MAX_QUANTITY = 500;


export const renderOffers = (offers) => {
  const randomOfferPrice = getRandomNumber(OFFER_PRICE_MAX_QUANTITY);
  const offersList = Array.from(offers).map((offer) => {
    return `
      <input class="point__offers-input visually-hidden" type="checkbox" id="${offer}" name="offer" value="${offer}">
      <label for="${offer}" class="point__offers-label">
        <span class="point__offer-service">${offer}</span> + €<span class="point__offer-price">${randomOfferPrice}</span>
      </label>
      `;
  });

  return offersList.join(``);
};
