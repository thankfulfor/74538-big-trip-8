import {Component} from './component';
import {renderEvents} from './render-events';
import flatpickr from 'flatpickr';
import {destinations} from './main';
import moment from 'moment';

export class PointForm extends Component {
  constructor() {
    super();
    this._renderEvents = renderEvents;
    this._onSubmit = null;
    this._onEscape = null;
    this._renderOffers = () => ``;
    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onEscapePress = this._onEscapePress.bind(this);
  }

  get saveButton() {
    return this._element.querySelector(`.point__button--save`);
  }

  getFlatpickrSettings(date, picker) {
    return {
      'defaultDate': date,
      'enableTime': true,
      'time_24hr': true,
      'altInput': true,
      'altFormat': `H:i`,
      'dateFormat': `Z`,
      'onClose': picker,
    };
  }

  triggerFlatpickr(parentElement, dateStart, dateEnd) {

    const startInputTimeElement = parentElement.querySelector(`input[name='dateStart']`);
    const endInputTimeElement = parentElement.querySelector(`input[name='dateEnd']`);

    const closeStart = (selectedDates, dateStr) => {
      endPicker.set(`minDate`, dateStr);
    };

    const closeEnd = (selectedDates, dateStr) => {
      startPicker.set(`maxDate`, dateStr);
    };
    const startPicker = flatpickr(startInputTimeElement, this.getFlatpickrSettings(dateStart, closeStart));
    const endPicker = flatpickr(endInputTimeElement, this.getFlatpickrSettings(dateEnd, closeEnd));
  }

  renderTimeInputs(dateStart, dateEnd) {
    return (
      `<div class="point__time">
      choose time
        <input
          class="point__input"
          type="text"
          value="${dateStart}"
          name="dateStart"
          placeholder="${dateStart}"
          required
        />
        <span class="point__input point__input--separator">–</span>
        <input
          class="point__input"
          type="text"
          value="${dateEnd}"
          name="dateEnd"
          placeholder="${dateEnd}"
          required
        />
    </div>`
    );
  }

  renderOptions(destinationsListItem) {
    const names = destinationsListItem.map((item) => item.name);
    const optionsList = names.map((name) => {
      return `<option value="${name}"></option>`;
    });
    return optionsList.join(``);
  }

  updateDesription(pictures, description) {
    this._pictures = pictures;
    this._description = description;
  }

  renderDeleteButton() {
    return ``;
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
            
            ${this.renderTime()}

            <label class="point__price">
              write price
              <span class="point__price-currency">€</span>
              <input class="point__input" type="number" value="${this._price}" name="price" placeholder="999" required>
            </label>
      
            <div class="point__buttons">
              <button class="point__button point__button--save" type="submit">Save</button>
              ${this.renderDeleteButton()}
            </div>
      
            <div class="paint__favorite-wrap">
              <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite" ${this._isFavorite ? `checked` : ``}>
                <label class="point__favorite" for="favorite">favorite</label>
              </div>
            </header>
        
            <section class="point__details">

              ${this._renderOffers(this._offers)}
            
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

  _processForm() {}

  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    let inputs = [];

    const checkFormValidity = () => {
      const travelInputsElements = document.querySelectorAll(`.travel-way__select-input`);
      function isChecked(radio) {
        return radio.checked;
      }

      document.querySelector(`.travel-way__label`).classList.toggle(
          `input-round--invalid`, ![...travelInputsElements].some(isChecked)
      );
      document.querySelector(`.point__destination-wrap`).classList.toggle(
          `input--invalid`, !document.querySelector(`.point__destination-input`).checkValidity()
      );
      document.querySelector(`.point__price .point__input`).classList.toggle(
          `input--invalid`, !document.querySelector(`.point__price .point__input`).checkValidity()
      );

      inputs.push([...travelInputsElements].some(isChecked));
      inputs.push(document.querySelector(`.point__destination-input`).checkValidity());
      inputs.push(document.querySelector(`.point__price .point__input`).checkValidity());
      return inputs.every((input) => input);
    };

    if (checkFormValidity()) {
      evt.target.innerText = `Saving...`;
      const formData = new FormData(this._element.querySelector(`.point__form`));
      const newData = this._processForm(formData, this._offers);
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
    if (evt.keyCode === 27 && typeof this._onEscape === `function`) {
      this._onEscape();
    }
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  shake() {}

  commonHandlers() {
    this.saveButton.addEventListener(`click`, this._onSubmitButtonClick);

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
}
