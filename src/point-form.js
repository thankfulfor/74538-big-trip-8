import {Component} from './component';
import {renderEvents} from './render-events';
import flatpickr from 'flatpickr';

export class PointForm extends Component {
  constructor() {
    super();
    this._renderEvents = renderEvents;
    this._onSubmit = null;
    this._onEscape = null;
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

  static createMapper() {}

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
}
