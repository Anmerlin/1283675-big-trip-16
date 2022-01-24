import AbstractView from './abstract-view.js';

const createListPointsTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class ListPoints extends AbstractView {
  get template() {
    return createListPointsTemplate();
  }
}
