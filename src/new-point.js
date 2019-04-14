import {Component} from './component';
import flatpickr from 'flatpickr';
import moment from 'moment';
import {renderEvents, events} from './render-events';
import {destinations} from './main';
import {Adapter} from './adapter';

export class NewPoint extends Component {
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
    this._renderEvents = renderEvents;
    this._onSubmit = null;
    this._onEscape = null;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onEscapePress = this._onEscapePress.bind(this);
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
    this._price = data.price;
    this._time = data.time;
    this._title = data.title;
    this._isFavorite = data.isFavorite;
  }

  updateDesription(pictures, description) {
    this._pictures = pictures;
    this._description = description;
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

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    let inputs = [];

    const checkFormValidity = () => {
      const travelInputsElements = document.getElementsByName(`travelWay`);
      function isChecked(radio) {
        return radio.checked;
      }

      inputs.push([...travelInputsElements].some(isChecked));
      inputs.push(document.querySelector(`.point__destination-input`).checkValidity());
      inputs.push(document.getElementsByName(`dateStart`)[0].checkValidity());
      inputs.push(document.getElementsByName(`dateEnd`)[0].checkValidity());
      inputs.push(document.querySelector(`.point__price .point__input`).checkValidity());

      return inputs.every((input) => input);
    };

    if (checkFormValidity()) {
      evt.target.innerText = `Saving...`;
      const formData = new FormData(this._element.querySelector(`.point__form`));
      const newData = this._processForm(formData);
      if (typeof this._onSubmit === `function`) {
        this._onSubmit(newData);
      }
      this.update(newData);
    } else {
      this.shake();
    }
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
              <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle" required>
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
      
            <div class="point__time">
              choose time
              <input
                  class="point__input"
                  type="text"
                  value="${this._time.startTime}"
                  name="dateStart"
                  placeholder="3:20"
                  required
              />
              <span class="point__input point__input--separator">–</span>
              <input
                  class="point__input"
                  type="text"
                  value="${this._time.endTime}"
                  name="dateEnd"
                  placeholder="7:40"
                  required
              />
            </div>
      
            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="text" value="${this._price}" name="price" placeholder="999" required>
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

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._element.style.border = `1px solid red`;
    this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    this._element.querySelector(`.point__button--save`).innerText = `Save`;

    setTimeout(() => {
      this._element.style.animation = ``;
      this._element.style.border = `none`;
    }, ANIMATION_TIMEOUT);
  }

  bind() {
    this._element.querySelector(`.point__button--save`).addEventListener(`click`, this._onSubmitButtonClick);

    const startInputTimeElement = this._element.querySelector(`input[name='dateStart']`);
    const endInputTimeElement = this._element.querySelector(`input[name='dateEnd']`);

    flatpickr(startInputTimeElement, {
      'defaultDate': `0`,
      'enableTime': true,
      'time_24hr': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`
    });

    flatpickr(endInputTimeElement, {
      'defaultDate': `0`,
      'enableTime': true,
      'time_24hr': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`
    });

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);

    travelInputsCollection.forEach((travelInput) => {
      travelInput.onclick = () => {
        travelInput.setAttribute(`checked`, true);
        document.querySelector(`.travel-way__label`).innerText = events[travelInput.value].icon;
        document.querySelector(`.point__destination-label`).innerText = events[travelInput.value].activity;
        document.querySelector(`.travel-way__toggle`).checked = false;
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

    document.addEventListener(`keydown`, this._onEscapePress);
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`click`, this._onSubmitButtonClick);

    document.removeEventListener(`keydown`, this._onEscapePress);
  }
}
