import moment from 'moment';
import {events} from './render-events';
import {renderOffers} from './render-offers';
import {destinations, offers} from './main';
import {PointForm} from './point-form';

export class EditPoint extends PointForm {
  constructor(data) {
    super();
    this._id = data.id;
    this._icon = events[data.title].icon;
    this._activity = events[data.title].activity;
    this._city = data.city;
    this._pictures = data.pictures;
    this._description = data.description;
    this._date = data.date;
    this._time = data.time;
    this._price = data.price;
    this._offers = data.offers;
    this._isFavorite = data.isFavorite;
    this._renderOffers = renderOffers;
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
  }

  get deleteButton() {
    return this._element.querySelector(`.point__button--delete`);
  }

  update(data) {
    this._activity = data.activity;
    this._city = data.city;
    this._icon = data.icon;
    this._offers = data.offers;
    this._price = data.price;
    this._time = data.time;
    this._isFavorite = data.isFavorite;
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
      favorite: (value) => (target.isFavorite = Boolean(value)),
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
      isFavorite: false,
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
                  required
              />
              <datalist id="destination-select">
                ${this.renderOptions(destinations)}
              </datalist>
            </div>
            
            ${this.renderTimeInputs(this._time.startTime, this._time.endTime)}
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price" required>
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              <button class="point__button point__button--delete" type="reset">Delete</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
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
      this.deleteButton.innerText = `Deleting...`;
    }
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.classList.add(`error-animation`);
    this.saveButton.innerText = `Save`;
    this.deleteButton.innerText = `Delete`;

    setTimeout(() => {
      this._element.classList.remove(`error-animation`);
    }, ANIMATION_TIMEOUT);

  }

  bind() {
    this.saveButton.addEventListener(`click`, this._onSubmitButtonClick);
    this.deleteButton.addEventListener(`click`, this._onDeleteButtonClick);

    this.triggerFlatpickr(this._element, this._time.startTime, this._time.endTime);
    //
    // flatpickr(this._element.querySelector(`input[name='dateStart']`),
    //   {
    //     'defaultDate': new Date(),
    //     'enableTime': true,
    //     'time_24hr': true,
    //     'altInput': true,
    //     'altFormat': `H:i`,
    //     'dateFormat': `Z`,
    //   });
    // flatpickr(this._element.querySelector(`input[name='dateEnd']`),
    //   {
    //     'defaultDate': new Date(),
    //     'enableTime': true,
    //     'time_24hr': true,
    //     'altInput': true,
    //     'altFormat': `H:i`,
    //     'dateFormat': `Z`,
    //   });

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);
    const offersWrapElement = this._element.querySelector(`.point__offers-wrap`);

    const renameObjectField = (oldKey, newKey, object) => {
      if (oldKey !== newKey) {
        Object.defineProperty(object, newKey, Object.getOwnPropertyDescriptor(object, oldKey));
        delete object[oldKey];
        object.accepted = ``;
      }
    };

    const onTravelInputClick = (evt) => {
      evt.target.checked = true;
      document.querySelector(`.travel-way__label`).innerText = events[evt.target.value].icon;
      document.querySelector(`.point__destination-label`).innerText = events[evt.target.value].activity;
      document.querySelector(`.travel-way__toggle`).checked = false;
      let newOffers = [];
      offers.forEach(function (offer) {
        if (evt.target.value === offer.type) {
          newOffers = offer.offers;
          newOffers.forEach(function (newOffer) {
            if (newOffer !== null && !newOffer.title) {
              renameObjectField(`name`, `title`, newOffer);
            }
          });
        }
      });
      offersWrapElement.innerHTML = renderOffers(newOffers);
      this.updateOffers(newOffers);
    };

    travelInputsCollection.forEach((travelInput) => {
      travelInput.addEventListener(`click`, onTravelInputClick);
    });

    const destinationInputElement = this._element.querySelector(`.point__destination-input`);
    const destinationTextElement = this._element.querySelector(`.point__destination-text`);
    const destinationImageElements = this._element.querySelector(`.point__destination-images`);

    const onDestinationInputElementClick = () => {
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

    destinationInputElement.addEventListener(`change`, onDestinationInputElementClick);
    document.addEventListener(`keydown`, this._onEscapePress);
  }

  unbind() {
    this.saveButton.removeEventListener(`click`, this._onSubmitButtonClick);
    this.deleteButton.removeEventListener(`click`, this._onDeleteButtonClick);

    document.removeEventListener(`keydown`, this._onEscapePress);
  }
}
