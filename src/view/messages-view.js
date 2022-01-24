import { showMessage } from '../helpers/common.js';
import AbstractView from './abstract-view.js';

const createMessageTemplate = () => (
  `<p class="trip-events__msg">
    ${showMessage('Everything')}
  </p>`
);

export default class MessageView extends AbstractView {
  get template() {
    return createMessageTemplate();
  }
}
