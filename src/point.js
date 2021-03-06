import {Component} from './component';
import {events} from './render-events';
import moment from 'moment';

export class Point extends Component {
  constructor(data) {
    super();
    this._icon = events[data.title].icon;
    this._activity = events[data.title].activity;
    this._city = data.city;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  _renderListItem(offers) {
    const offersList = offers.map((offer, index) => {
      if (offer.accepted && (index < 3)) {
        return (
          `<li><button class="trip-point__offer">${offer.title} +&euro;&nbsp;${offer.price}</button></li>`
        );
      }
      return null;
    });

    return offersList.join(``);
  }

  update(data) {
    this._icon = events[data.title].icon;
    this._activity = events[data.title].activity;
    this._city = data.city;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }

  get template() {
    const diff = moment(this._time.endTime).diff(moment(this._time.startTime));
    const duration = moment.duration(diff);
    let formattedDifference = ``;
    if (Math.floor(duration.asDays()) > 0) {
      formattedDifference = Math.floor(duration.asDays()) + moment.utc(diff).format(`[D] HH[H] mm[M]`);
    } else if (Math.floor(duration.asMinutes()) < 60) {
      formattedDifference = moment.utc(diff).format(`mm[M]`);
    } else {
      formattedDifference = moment.utc(diff).format(`HH[H] mm[M]`);
    }

    return (
      `<article class="trip-point">
        <i class="trip-icon">${this._icon}</i>
        <h3 class="trip-point__title">${this._activity + ` ` + this._city}</h3>
        <p class="trip-point__schedule">
          <span class="trip-point__timetable">${moment(this._time.startTime).format(`HH:mm`)} – ${moment(this._time.endTime).format(`HH:mm`)}</span>
          
            <span class="trip-point__duration">${formattedDifference}</span>
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
}
