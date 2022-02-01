import { calculateDuration, showPointDataHelper } from '../helpers/common.js';
import AbstractView from './abstract-view.js';

const showOffers = (offers) =>
  `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offers.map((offer) =>
    `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`).join('\n')}
  </ul>`;

const createShowPointTemplate = (point) => {
  const { type, destination: {name}, dateStart, dateEnd, basePrice, offers, isFavorite } = point;
  const [dateEvent, shortDateEvent, timeStart, shortTimeStart, timeEnd, shortTimeEnd] = showPointDataHelper(dateStart, dateEnd);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateEvent}">${shortDateEvent}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type ? type.toLowerCase() : 'transport'}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${timeStart}">${shortTimeStart}</time>
        &mdash;
        <time class="event__end-time" datetime="${timeEnd}">${shortTimeEnd}</time>
      </p>
      <p class="event__duration">${calculateDuration(point)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    ${offers.length !== 0 ? showOffers(offers) : ''}
    <button class="event__favorite-btn ${(isFavorite) ? 'event__favorite-btn--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class PointView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createShowPointTemplate(this.#point);
  }

  setFavoriteButtonClickHandler = (callback) => {
    this._callback.favoriteButtonClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteButtonClickHandler);
  }

  setButtonEditClickHandler = (callback) => {
    this._callback.editButtonClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editButtonClickHandler);
  }

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteButtonClick();
  }

  #editButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editButtonClick();
  }
}
