import {Component} from './component';
import {showFilters} from './render-filter';

export class Sort extends Component {
  constructor() {
    super();
    this._showFilters = showFilters;
  }

  get template() {

    const sorters = [
      {
        checked: true,
        name: `Event`,
      },
      {
        checked: false,
        name: `Time`,
      },
      {
        checked: false,
        name: `Price`,
      }
    ];
    return (
      `<span>
        ${this._showFilters(`sorting`, sorters)}
        <span class="trip-sorting__item trip-sorting__item--offers">Offers</span>
      </span>
      `
    );
  }

  get element() {
    return this._element;
  }

  bind() {}

  unbind() {}
}
