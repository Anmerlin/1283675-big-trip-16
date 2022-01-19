import { createElement } from '../helpers/helpers.js';

const createListPointsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListPoints {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createListPointsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

// export { createListPointsTemplate };
