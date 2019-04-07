import {Component} from './component';
import flatpickr from 'flatpickr';
import moment from 'moment';
import {renderEvents, events} from './render-events';
import {renderOffers} from './render-offers';
import {destinations, offers} from './main';

export class EditPoint extends Component {
  constructor(data) {
    super();
    this._id = data.id;
    this._title = data.title;
    this._icon = events[data.title].icon;
    this._activity = events[data.title].activity;
    this._city = data.city;
    this._pictures = data.pictures;
    this._description = data.description;
    this._date = data.date;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._renderEvents = renderEvents;
    this._renderOffers = renderOffers;
    this._onSubmit = null;
    this._onDelete = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  renderOptions(destinationsListItem) {
    const names = destinationsListItem.map((item) => item.name);
    const optionsList = names.map((name) => {
      return `<option value="${name}"></option>`;
    });
    return optionsList.join(``);
  }

  update(data) {
    this._activity = data.activity;
    this._city = data.city;
    this._icon = data.icon;
    this._offers = data.offers;
    this._price = data.price;
    this._time = data.time;
    this._title = data.title;
  }

  updateDesription(pictures, description) {
    this._pictures = pictures;
    this._description = description;
  }

  updateOffers(newOffers) {
    this._offers = newOffers;
  }

  static createMapper(target) {
    return {
      dateEnd: (value) => (target.time.endTime = value),
      dateStart: (value) => (target.time.startTime = value),
      destination: (value) => (target.city = value),
      price: (value) => (target.price = value),
      travelWay: (value) => (target.activity = value),
    };
  }

  _processForm(formData, offersData) {
    const entry = {
      city: ``,
      destination: ``,
      offers: [],
      price: ``,
      time: new Date(),
      title: ``,
      travelWay: ``,
    };
    offersData.forEach((offer) => {
      offer.accepted = false;
    });

    const editPointMapper = EditPoint.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (editPointMapper[property]) {
        editPointMapper[property](value);
      }
      if (property === `travelWay`) {
        entry.activity = events[value].activity;
        entry.icon = events[value].icon;
        entry.title = value;
      }
      if (property === `offer`) {
        offersData.forEach((offer) => {
          if (offer.title === value) {
            offer.accepted = true;
          }
        });
      }
    }
    entry.offers = offersData;
    return entry;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    evt.target.innerText = `Saving...`;
    const formData = new FormData(this._element.querySelector(`.point__form`));
    const newData = this._processForm(formData, this._offers);
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
              <input class="point__input" type="text" placeholder="${moment(this._date).format(`LL`)}" name="day">
            </label>
      
            <div class="travel-way">
              <label class="travel-way__label" for="travel-way__toggle">${this._icon}️</label>
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">
              ${this._renderEvents(this._icon)}
            </div>
      
            <div class="point__destination-wrap">
              <label class="point__destination-label" for="destination">${this._activity}</label>
              <input
                  class="point__destination-input"
                  list="destination-select"
                  id="destination"
                  value="${this._city}"
                  name="destination"
              />
              <datalist id="destination-select">
                ${this.renderOptions(destinations)}
              </datalist>
            </div>
      
            <div class="point__time">
              choose time
              <input
                  class="point__input"
                  type="text"
                  value="${this._time.startTime}"
                  name="dateStart"
                  placeholder="${this._time.startTime}"
              />
              <input
                  class="point__input"
                  type="text"
                  value="${this._time.endTime}"
                  name="dateEnd"
                  placeholder="${this._time.endTime}"
              />
            </div>
      
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
                ${this._description}
              </p>
              <div class="point__destination-images">
              ${this._pictures.map((picture) => (`<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`))}
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

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
      this._element.querySelector(`.point__button--delete`).innerText = `Deleting...`;
    }
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.border = `1px solid red`;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._element.querySelector(`.point__button--save`).innerText = `Save`;
    this._element.querySelector(`.point__button--delete`).innerText = `Delete`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._element.style.border = `none`;
    }, ANIMATION_TIMEOUT);

  }

  bind() {
    this._element.querySelector(`.point__button--save`)
      .addEventListener(`click`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button--delete`)
      .addEventListener(`click`, this._onDeleteButtonClick);

    const startInputTimeElement = this._element.querySelector(`input[name='dateStart']`);
    const endInputTimeElement = this._element.querySelector(`input[name='dateEnd']`);

    flatpickr(startInputTimeElement, {
      'defaultDate': this._time.startTime,
      'enableTime': true,
      'time_24hr': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`
    });

    flatpickr(endInputTimeElement, {
      'defaultDate': this._time.endTime,
      'enableTime': true,
      'time_24hr': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`
    });

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);
    const offersWrapElement = this._element.querySelector(`.point__offers-wrap`);

    const renameObjectField = (oldKey, newKey, object) => {
      if (oldKey !== newKey) {
        Object.defineProperty(object, newKey, Object.getOwnPropertyDescriptor(object, oldKey));
        delete object[oldKey];
        object.accepted = ``;
      }
    };

    let newOffers = [];

    travelInputsCollection.forEach((travelInput) => {
      travelInput.onclick = () => {
        travelInput.setAttribute(`checked`, true);
        document.querySelector(`.travel-way__label`).innerText = events[travelInput.value].icon;
        document.querySelector(`.point__destination-label`).innerText = events[travelInput.value].activity;
        document.querySelector(`.travel-way__toggle`).checked = false;
        offers.some(function (offer) {
          if (travelInput.value === offer.type) {
            newOffers = offer.offers;
            newOffers.forEach(function (newOffer) {
              if (newOffer !== null) {
                renameObjectField(`name`, `title`, newOffer);
              }
            });
          }
          offersWrapElement.innerHTML = renderOffers(newOffers);
        });
        this.updateOffers(newOffers);
      };
    });

    const destinationInputElement = this._element.querySelector(`.point__destination-input`);
    const destinationTextElement = this._element.querySelector(`.point__destination-text`);
    const destinationImageElements = this._element.querySelector(`.point__destination-images`);

    destinationInputElement.onchange = () => {
      let description = ``;
      let photos = [];
      destinations.some(function (destination) {
        if (destinationInputElement.value === destination.name) {
          destinationTextElement.innerText = destination.description;
          description = destination.description;
          photos = destination.pictures;
          destinationImageElements.innerHTML = destination.pictures.map((picture) => (`<img src="${picture.src}" alt="${picture.description}" class="point__destination-image">`)).join(``);
        }
      });
      this.updateDesription(photos, description);
    };
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);

    this._element.querySelector(`.point__button--delete`)
      .removeEventListener(`click`, this._onDeleteButtonClick);
  }
}
