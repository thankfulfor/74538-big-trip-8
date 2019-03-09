import {getRandomNumber, createElement} from './utils';

const OFFER_PRICE_MAX_QUANTITY = 500;

export class Point {
  constructor(data) {
    this._icon = data.icon;
    this._title = data.title;
    this._city = data.city;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._element = null;

    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _renderListItem(offers) {
    const randomPrice = getRandomNumber(OFFER_PRICE_MAX_QUANTITY);
    const offersList = Array.from(offers).map((offer) => {
      return `<li><button class="trip-point__offer">${offer} +&euro;&nbsp;${randomPrice}</button></li>`;
    });

    return offersList.join(``);
  }

  get template() {
    return (
      `<article class="trip-point">
        <i class="trip-icon">${this._icon}</i>
        <h3 class="trip-point__title">${this._title + this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${this._time.randomTimeFromFormatted} &mdash; ${this._time.randomTimeToFormatted}</span>
          <span class="trip-point__duration">${this._time.durationFormatted}</span>
        </p>
        <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
        <ul class="trip-point__offers">
          ${this._renderListItem(this._offers)}
        </ul>
      </article>`
    );
  }

  get element() {
    return this._element;
  }

  set onEdit(fn) {
    this._onEdit = fn;
  }

  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  bind() {
    this._element.addEventListener(`click`, this._onEditButtonClick);
  }

  unbind() {
    this._element.removeEventListener(`click`, this._onEditButtonClick);
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
