import {events} from './render-events';
import {renderOffers} from './render-offers';
import {offers} from './main';
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

  renderTime() {
    return this.renderTimeInputs(this._time.startTime, this._time.endTime);
  }

  renderDeleteButton() {
    return `<button class="point__button point__button--delete" type="reset">Delete</button>`;
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
    this.commonHandlers();

    this.deleteButton.addEventListener(`click`, this._onDeleteButtonClick);

    this.triggerFlatpickr(this._element, this._time.startTime, this._time.endTime);

    const travelInputsCollection = this._element.querySelectorAll(`.travel-way__select-input`);
    const offersWrapElement = this._element.querySelector(`.point__offers`);

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

  }

  unbind() {
    this.saveButton.removeEventListener(`click`, this._onSubmitButtonClick);
    this.deleteButton.removeEventListener(`click`, this._onDeleteButtonClick);

    document.removeEventListener(`keydown`, this._onEscapePress);
  }
}
