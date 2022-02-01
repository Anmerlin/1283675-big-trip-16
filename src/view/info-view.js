import { getTravelTime, getTripRoute, getTripCost} from '../helpers/common.js';
import AbstractView from './abstract-view.js';

const createTripInfoTemplate = (points) => (points.length !== 0) ? `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripRoute(points)}</h1>
      <p class="trip-info__dates">${getTravelTime(points)}</p>
    </div>
    <p class="trip-info__cost">
      Total: &euro;&nbsp; <span class="trip-info__cost-value">${getTripCost(points)}</span>
    </p>
  </section>` : '';
export default class TripInfoView extends AbstractView {
  #points = null;

  constructor(points) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate(this.#points);
  }
}
