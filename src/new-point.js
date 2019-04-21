import {events} from './render-events';
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

  renderTime() {
    return this.renderTimeInputs(new Date(), new Date());
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
