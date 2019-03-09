import {getRandomNumber, createElement} from './utils';

const OFFER_PRICE_MAX_QUANTITY = 500;

const renderListItem = function (offers) {
  const randomPrice = getRandomNumber(OFFER_PRICE_MAX_QUANTITY);
  const offersList = Array.from(offers).map((offer) => {
    return `
          <input class="point__offers-input visually-hidden" type="checkbox" id="${offer}" name="offer" value="${offer}">
          <label for="${offer}" class="point__offers-label">
            <span class="point__offer-service">${offer}</span> + €<span class="point__offer-price">${randomPrice}</span>
          </label>
          `;
  });

  return offersList.join(``);
};

export class EditPoint {
  constructor(data) {
    this._icon = data.icon;
    this._title = data.title;
    this._city = data.city;
    this._picture = data.picture;
    this._descriptions = data.descriptions;
    this._date = data.date;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._element = null;

    this._onSubmit = null;
    this._onReset = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onResetButtonClick = this._onResetButtonClick.bind(this);
  }

  get template() {

    return (
      `<article class="point">
        <form action="" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="${this._date}" name="day">
            </label>
      
            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${this._icon}️</label>
      
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
      
              <div class="travel-way__select">
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi">
                  <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus">
                  <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train">
                  <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" checked>
                  <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
                </div>
      
                <div class="travel-way__select-group">
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in">
                  <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>
      
                  <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing">
                  <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
                </div>
              </div>
            </div>
      
            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._title}</label>
              <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
              <datalist id="destination-select">
                <option value="airport"></option>
                <option value="Geneva"></option>
                <option value="Chamonix"></option>
                <option value="hotel"></option>
              </datalist>
            </div>
      
            <label class="point__time">
              choose time
              <input
                class="point__input"
                type="text"
                value="${this._time.randomTimeFromFormatted} &mdash; ${this._time.randomTimeToFormatted}"
                name="time"
                placeholder="${this._time.randomTimeFromFormatted} &mdash; ${this._time.randomTimeToFormatted}"
              >
            </label>
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price">
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button point__button--delete" type="reset">Delete</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
              <label class="point__favorite" for="favorite">favorite</label>
            </div>
          </header>
      
          <section class="point__details">
            <section class="point__offers">
              <h3 class="point__details-title">offers</h3>
      
              <div class="point__offers-wrap">
                ${renderListItem(this._offers)}
              </div>
      
            </section>
            <section class="point__destination">
              <h3 class="point__details-title">Destination</h3>
              <p class="point__destination-text">
                ${this._descriptions}
              </p>
              <div class="point__destination-images">
                <img src="${this._picture}" alt="picture from place" class="point__destination-image">
              </div>
            </section>
            <input type="hidden" class="point__total-price" name="total-price" value="">
          </section>
        </form>
      </article>`
    );
  }

  get element() {
    return this._element;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  _onResetButtonClick() {
    if (typeof this._onReset === `function`) {
      this._onReset();
    }
  }

  bind() {
    this._element.querySelector(`.point__button--save`)
      .addEventListener(`click`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button--delete`)
      .addEventListener(`click`, this._onResetButtonClick);
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button--delete`)
      .removeEventListener(`click`, this._onResetButtonClick);
  }

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
