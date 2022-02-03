import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import rangePlugin from '../../node_modules/flatpickr/dist/plugins/rangePlugin';
import { setCapitalizeText } from '../helpers/helpers.js';
import { FormState } from '../helpers/consts.js';
import { getUniqueMarkupName } from '../helpers/common.js';
import SmartView from './smart-view.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const getAvailableOffers = (type, offers) => (offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase())).offers;

const generateOffersList = (availableOffers, selectedOffers, isDisabled) => `
  <div class="event__available-offers">${availableOffers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getUniqueMarkupName(offer.title)}-1" type="checkbox" name="event-offer-${getUniqueMarkupName(offer.title)}" ${(selectedOffers.find((item) => item.title === offer.title)) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} data-offer-title="${offer.title}" data-offer-price="${offer.price}">
    <label class="event__offer-label" for="event-offer-${getUniqueMarkupName(offer.title)}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('\n')}
</div>`;

const showOffers = (availableOffers, selectedOffers, type, isDisabled) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    ${!type ? 'Please select event type for additional offers' : generateOffersList(availableOffers, selectedOffers, isDisabled)}
  </section>`;

const generateDestinationInfo = ({ description = '', pictures = [] }) => `
  <p class="event__destination-description">${description}</p>
  ${(pictures.length !== 0) ?
    `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n')}
    </div>
  </div>` : ''}`;

const showDestination = (destination) =>
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${!Object.keys(destination).length ? generateDestinationInfo({ description: 'Please select the destination for preview', pictures: [] }) : generateDestinationInfo(destination)}
  </section>`;

const generatePointTypeList = (type, offers) => `${offers
  .map((offer) =>
    `<div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${(offer.type === type.toLowerCase()) ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${setCapitalizeText(offer.type)}</label>
    </div>`)
  .join('\n\n')}`;

const generateDestinationlist = (destinations) => `${destinations
  .map((destination) =>
    `<option value="${destination.name}"></option>`
  )
  .join('\n')}`;

const getDestination = (name, destinations) => (destinations.find((destination) => destination.name === name));

const createPointTemplate = (point, offers, destinations, state) => {
  const {
    type,
    destination,
    dateStart,
    dateEnd,
    basePrice,
    offersPoint,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const allPointOffers = type ? getAvailableOffers(type, offers) : [];
  const destinationInfo = getDestination(destination.name, destinations) || {};

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type ? type.toLowerCase() : 'transport'}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
              <legend class="visually-hidden">Event type</legend>
                ${generatePointTypeList(type, offers)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type ? type : 'Select type'}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name || ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''} placeholder="Select destination">
          <datalist id="destination-list-1">
            ${generateDestinationlist(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateStart).format('DD[/]MM[/]YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateEnd).format('DD[/]MM[/]YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" pattern="^[ 0-9]+$" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${(state === FormState.DEFAULT) ? `${isDeleting ? 'Deleting...' : 'Delete'}` : 'Cancel'}</button>
        ${(state === FormState.DEFAULT) ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">

        ${allPointOffers.length && showOffers(allPointOffers, offersPoint, type, isDisabled) || `${state === FormState.ADD && type === '' ? showOffers(allPointOffers, offersPoint, type, isDisabled) : ''}`}

        ${Object.keys(destinationInfo).length && showDestination(destinationInfo) || `${state === FormState.ADD ? showDestination(destinationInfo) : ''}`}
      </section>
    </form>
  </li>`;
};

export default class PointEditView extends SmartView {
  #offers= null;
  #destinations = null;
  #state = null;
  #rangeDatepicker = null;

  constructor(point, offersModel, destinationsModel, state) {
    super();
    this.#offers = offersModel.offers;
    this.#destinations = destinationsModel.destinations;
    this.#state = state;

    this._data = PointEditView.parsePointToData(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createPointTemplate(this._data, this.#offers, this.#destinations, this.#state);
  }

  static parsePointToData = (point) => ({...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseDataToPoint = (data) => {
    const point = {...data};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

  removeElement = () => {
    super.removeElement();
    this.removeRangeDatepicker();
  }

  setButtonEditClickHandler = (callback) => {
    this._callback.buttonEditClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonEditClickHandler);
  }

  setButtonDeleteClickHandler = (callback) => {
    this._callback.buttonDeleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  setRangeDatepicker = () => {
    this.removeRangeDatepicker();

    this.#rangeDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onChange: this.#pointDateRangeChangeHandler,
        plugins: [new rangePlugin({ input: this.element.querySelector('#event-end-time-1') })],
      },
    );
  }

  setPriceChangeHandler = (callback) => {
    this._callback.priceChange = callback;
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointChangeHandler);
  }

  removeRangeDatepicker = () => {
    if (this.#rangeDatepicker) {
      this.#rangeDatepicker.destroy();
      this.#rangeDatepicker = null;
    }
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setRangeDatepicker();
    this.setPriceChangeHandler();
    this.setFormSubmitHandler(this._callback.formSubmit);
    if (this.#state === FormState.DEFAULT) {
      this.setButtonEditClickHandler(this._callback.buttonEditClick);
    }
    this.setButtonDeleteClickHandler(this._callback.buttonDeleteClick);
  }

  #buttonEditClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonEditClick();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#checkOffersHandler();
    this._callback.formSubmit(PointEditView.parseDataToPoint(this._data));
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.buttonDeleteClick(PointEditView.parseDataToPoint(this._data));
  }

  #destinationChangeHandler = (evt) => {
    const destination = getDestination(evt.target.value, this.#destinations);
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destination === undefined) {
      destinationInput.setCustomValidity('Unfortunately this place unable for a trip');
      destinationInput.reportValidity();
      return;
    }
    destinationInput.setCustomValidity('');
    destinationInput.reportValidity();
    this.updateData({
      destination,
    });
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  #checkOffersHandler = () => {
    if (!this.element.querySelector('.event__available-offers')) {
      return;
    }

    const availableOffers = getAvailableOffers(this._data.type, this.#offers);
    const selectedOffers = this.element.querySelectorAll('.event__offer-checkbox:checked');

    const offers = availableOffers.filter((offer) => [...selectedOffers].find((item) => offer.title === item.dataset.offerTitle));

    this.updateData({
      offersPoint: offers,
    }, true);
  }

  #pointDateRangeChangeHandler = ([userDateStart, userDateEnd]) => {
    this.updateData({
      dateStart: userDateStart,
      dateEnd: userDateEnd,
    }, true);
  }

  #pointChangeHandler = (evt) => {
    const basePrice = Number(evt.target.value);
    if (basePrice > 0) {
      this.updateData({
        basePrice,
      }, true);
    }
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  }
}
