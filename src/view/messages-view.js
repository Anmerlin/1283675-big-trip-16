import { Messages } from '../helpers/common.js';
import AbstractView from './abstract-view.js';

const createMessageTemplate = (filterType) => (
  `<p class="trip-events__msg">
    ${Messages[filterType]}
  </p>`
);

export default class MessageView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createMessageTemplate(this._data);
  }
}
