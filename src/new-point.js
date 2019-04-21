import moment from 'moment';
import {events} from './render-events';
import {destinations} from './main';
import {Adapter} from './adapter';
import {PointForm} from './point-form';

export class NewPoint extends PointForm {
  constructor() {
    super();
    this._id = ``;
    this._title = `new`;
    this._icon = events[this._title].icon;
    this._activity = events[this._title].activity;
    this._city = ``;
    this._pictures = [];
    this._description = ``;
    this._time = {};
    this._price = ``;
    this._isFavorite = false;
  }

  update(data) {
    this._activity = data.activity;
    this._city = data.city;
    this._icon = data.icon;
    this._price = data.price;
    this._time = data.time;
    this._title = data.title;
    this._isFavorite = data.isFavorite;
  }

  static createMapper(target) {
    return {
      dateEnd: (value) => (target.time.endTime = value),
      dateStart: (value) => (target.time.startTime = value),
      destination: (value) => (target.city = value),
      price: (value) => (target.price = value),
      travelWay: (value) => (target.title = value),
      favorite: (value) => (target.isFavorite = Boolean(value)),
    };
  }

  _processForm(formData) {
    const entry = new Adapter({
      'id': this._id,
      'type': ``,
      'date_from': ``,
      'date_to': ``,
      'destination': {
        'name': ``,
        'description': this._description,
        'pictures': this._pictures,
      },
      'is_favorite': false,
      'base_price': ``,
      'offers': [],
    });

    const newPointMapper = NewPoint.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (newPointMapper[property]) {
        newPointMapper[property](value);
      }
    }
    return entry;
  }

  set onEscape(fn) {
    this._onEscape = fn;
  }

  _onEscapePress(evt) {
    if (evt.keyCode === 27) {
      if (typeof this._onEscape === `function`) {
        this._onEscape();
      }
    }
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
                  placeholder="Click here to choose a city"
                  required
              />
              <datalist id="destination-select">
                ${this.renderOptions(destinations)}
              </datalist>
            </div>
      
            ${this.renderTimeInputs(new Date(), new Date())}
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="number" value="${this._price}" name="price" placeholder="999" required>
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
                <label class="point__favorite" for="favorite">favorite</label>
              </div>
            </header>
            
            <section class="point__details">
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
          </section>
        </form>
      </article>`
    );
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.classList.add(`error-animation`);
    this.saveButton.innerText = `Save`;

    setTimeout(() => {
      this._element.classList.remove(`error-animation`);
    }, ANIMATION_TIMEOUT);
  }

  bind() {
    this.commonHandlers();

    this.triggerFlatpickr(this._element, new Date(), new Date());

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);

    travelInputsCollection.forEach((travelInput) => {
      travelInput.onclick = () => {
        travelInput.checked = true;
        document.querySelector(`.travel-way__label`).innerText = events[travelInput.value].icon;
        document.querySelector(`.point__destination-label`).innerText = events[travelInput.value].activity;
        document.querySelector(`.travel-way__toggle`).checked = false;
      };
    });
  }

  unbind() {
    this.saveButton.removeEventListener(`click`, this._onSubmitButtonClick);

    document.removeEventListener(`keydown`, this._onEscapePress);
  }
}
