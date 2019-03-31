import {createElement} from './utils';

export class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Не смей инстанцировать Component, его можно только наследовать)`);
    }

    this._element = null;
    this._isDeleted = false;
  }

  get template() {
    throw new Error(`Нужно определить шаблон.`);
  }

  get element() {
    return this._element;
  }

  bind() {}

  unbind() {}

  update() {}

  addEventListener() {}

  removeEventListener() {}

  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  unrender() {
    this.unbind();
    this._element = null;
  }
}
