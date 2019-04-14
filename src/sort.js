import {Component} from './component';
import {showFilters} from './render-filter';

export class Sort extends Component {
  constructor() {
    super();
    this._showFilters = showFilters;
    this._onSort = null;
    this._sortClick = this._sortClick.bind(this);
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  _sortClick(evt) {
    if (typeof this._onSort === `function`) {
      this._onSort(evt.target.innerText.trim());
    }
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

  bind() {
    const sortDefaultElement = this._element.querySelector(`.trip-sorting__item--event`);
    const sortByTimeElement = this._element.querySelector(`.trip-sorting__item--time`);
    const sortByPriceElement = this._element.querySelector(`.trip-sorting__item--price`);
    sortDefaultElement.addEventListener(`click`, this._sortClick);
    sortByTimeElement.addEventListener(`click`, this._sortClick);
    sortByPriceElement.addEventListener(`click`, this._sortClick);
  }

  unbind() {}
}
