import {Component} from './component';
import moment from 'moment';
import {renderEvents, events} from './render-events';
import {destinations} from './main';
import {Adapter} from './adapter';
import {triggerFlatpickr, renderTimeInputs} from './get-date-picker';

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

  get saveButton() {
    return this._element.querySelector(`.point__button--save`);
  }

  renderOptions(destinationsListItem) {
    const names = destinationsListItem.map((item) => item.name);
    const options = names.map((name) => {
      return `<option value="${name}"></option>`;
    });
    return options.join(``);
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
      const travelInputsElements = document.querySelectorAll(`.travel-way__select-input`);
      function isChecked(radio) {
        return radio.checked;
      }

      if (![...travelInputsElements].some(isChecked)) {
        document.querySelector(`.travel-way__label`).classList.toggle(`input-round--invalid`);
      } else {
        document.querySelector(`.travel-way__label`).classList.toggle(`input-round--invalid`);
      }

      const markInvalidInput = (input, label) => {
        if (!document.querySelector(input).checkValidity()) {
          document.querySelector(label).classList.toggle(`input--invalid`);
        } else {
          document.querySelector(label).classList.toggle(`input--invalid`);
        }
      };

      markInvalidInput(`.point__destination-input`, `.point__destination-wrap`);
      markInvalidInput(`.point__price .point__input`, `.point__price .point__input`);

      inputs.push([...travelInputsElements].some(isChecked));
      inputs.push(document.querySelector(`.point__destination-input`).checkValidity());
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
      
            ${renderTimeInputs(new Date(), new Date())}
      
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
    this._element.classList.add(`error-animation`);
    this.saveButton.innerText = `Save`;

    setTimeout(() => {
      this._element.classList.remove(`error-animation`);
    }, ANIMATION_TIMEOUT);
  }

  bind() {
    this.saveButton.addEventListener(`click`, this._onSubmitButtonClick);

    triggerFlatpickr(this._element, new Date(), new Date());

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);

    travelInputsCollection.forEach((travelInput) => {
      travelInput.onclick = () => {
        travelInput.checked = true;
        document.querySelector(`.travel-way__label`).innerText = events[travelInput.value].icon;
        document.querySelector(`.point__destination-label`).innerText = events[travelInput.value].activity;
        document.querySelector(`.travel-way__toggle`).checked = false;
      };
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

    document.removeEventListener(`keydown`, this._onEscapePress);
  }
}
