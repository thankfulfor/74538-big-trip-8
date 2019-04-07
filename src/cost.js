import {Component} from './component';

export class Cost extends Component {
  constructor() {
    super();
    this._totalPrice = 0;
  }

  get template() {
    return (
      `&euro;&nbsp;${this._totalPrice}`
    );
  }

  totalPrice(events) {
    this._totalPrice = 0;
    events.forEach((event) => {
      this._totalPrice += parseInt(event.price, 10);
      event.offers.forEach((offer) => {
        if (offer.accepted) {
          this._totalPrice += parseInt(offer.price, 10);
        }
      });
    });
  }

  get element() {
    return this._element;
  }

  bind() {}

  unbind() {}
}
