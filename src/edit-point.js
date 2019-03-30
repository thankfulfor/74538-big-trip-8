import {Component} from './component';
import flatpickr from 'flatpickr';
import {renderEvents, events} from './render-events';
import {renderOffers} from './render-offers';

export class EditPoint extends Component {
  constructor(data) {
    super();
    this._icon = data.icon;
    this._activity = data.activity;
    this._city = data.city;
    this._picture = data.picture;
    this._descriptions = data.descriptions;
    this._date = data.date;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._renderEvents = renderEvents;
    this._renderOffers = renderOffers;

    this._onSubmit = null;
    this._onReset = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onResetButtonClick = this._onResetButtonClick.bind(this);
  }

  update(data) {
    this._icon = data.icon;
    this._activity = data.activity;
    this._city = data.city;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
  }

  static createMapper(target) {
    return {
      icon: (value) => (target.icon = events[value].icon),
      destination: (value) => (target.city = value),
      travelWay: (value) => (target.activity = value),
      time: (value) => (target.time.startTime = value),
      price: (value) => (target.price = value),
      offer: (value) => target.offers.add(value),
    };
  }

  _processForm(formData) {
    const entry = {
      icon: ``,
      title: ``,
      travelWay: ``,
      destination: ``,
      city: ``,
      time: new Date(),
      price: ``,
      offers: new Set(),
      activity: ``,
    };

    const editPointMapper = EditPoint.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (editPointMapper[property]) {
        editPointMapper[property](value);
      }
      if (property === `travelWay`) {
        entry.icon = events[value].icon;
        entry.activity = events[value].activity;
      }
    }
    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    const formData = new FormData(this._element.querySelector(`.point__form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }
    this.update(newData);
  }

  get template() {
    return (
      `<article class="point">
        <form action="" class="point__form" method="get">
          <header class="point__header">
            <label class="point__date">
              choose day
              <input class="point__input" type="text" placeholder="${this._date}" name="day">
            </label>
      
            <div class="travel-way">
            
              <label class="travel-way__label" for="travel-way__toggle">${this._icon}️</label>
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
      
              ${this._renderEvents(this._icon)}
            </div>
      
            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._activity}</label>
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
                class="point__input point__input--time"
                type="text"
                value="${this._time.startTime} – ${this._time.endTime}"
                name="time"
                placeholder="${this._time.startTime} – ${this._time.endTime}"
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
                ${this._renderOffers(this._offers)}
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

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onReset(fn) {
    this._onReset = fn;
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

    const inputTimeElement = this._element.querySelector(`.point__input--time`);
    // eslint-disable-next-line camelcase
    flatpickr(inputTimeElement, {defaultDate: this._time.startTime, enableTime: true, time_24hr: true, noCalendar: true, altInput: true, altFormat: `H:i`, dateFormat: `H:i`});

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);
    travelInputsCollection.forEach(function (travelInput) {
      travelInput.addEventListener(`click`, function () {
        travelInput.setAttribute(`checked`, true);
        document.querySelector(`.point__destination-label`).innerText = events[travelInput.value].activity;
        document.querySelector(`.travel-way__label`).innerText = events[travelInput.value].icon;
        document.querySelector(`.travel-way__toggle`).checked = false;
      });
    });
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button--delete`)
      .removeEventListener(`click`, this._onResetButtonClick);
  }
}
