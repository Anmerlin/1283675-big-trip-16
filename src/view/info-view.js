import { createElement } from '../helpers/helpers.js';
import { getTravelTime, getTripRoute, getTripCost} from '../helpers/common.js';

const createTripInfoTemplate = (points) => (points.length !== 0) ? `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripRoute(points)}</h1>
      <p class="trip-info__dates">${getTravelTime(points)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp;
      ${getTripCost(points)}
    </p>
  </section>` : '';
export default class TripInfo {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
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
