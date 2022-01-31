import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import { getAvailableOffers } from '../mock/point.js';
import { dataOffers as ALL_OFFERS } from '../mock/offers.js';
import { dataDestinations as ALL_DESTINATIONS} from '../mock/destinations.js';
import { setCapitalizeText } from '../helpers/helpers.js';
import { FormState } from '../helpers/consts.js';
import SmartView from './smart-view.js';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const showOffers = (availableOffers, selectedOffers) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${availableOffers.map((offer) =>
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-1" type="checkbox" name="event-offer-${offer.title.split(' ').pop()}" ${(selectedOffers.find((item) => item.title === offer.title)) ? 'checked' : ''} >
        <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
    </div>`)
    .join('\n')}
  </div>
</section>`;

const showDestination = ({description = '', pictures = ''}) =>
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${(pictures.length !== 0) ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n')}
      </div>
    </div>` : ''}
  </section>`;

const generatePointTypeList = () => `${ALL_OFFERS
  .map((offer) =>
    `<div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${setCapitalizeText(offer.type)}</label>
    </div>`)
  .join('\n\n')}`;


const generateDestinationlist = () => `${ALL_DESTINATIONS
  .map((destination) =>
    `<option value="${destination.name}"></option>`
  )
  .join('\n')}`;

const getDestination = (name, destinations) => (destinations.find((destination) => destination.name === name));

const createPointTemplate = (point = {}, state) => {
  const { pointType = 'Flight', destination = {}, dateStart = dayjs(), dateEnd = dayjs(), basePrice = '', offers = [] } = point;
  const allPointOffers = getAvailableOffers(pointType, ALL_OFFERS);
  const destinationInfo = getDestination(destination.name, ALL_DESTINATIONS);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
                ${generatePointTypeList()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name || ''}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${generateDestinationlist()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateStart).format('DD[/]MM[/]YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateEnd).format('DD[/]MM[/]YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${(state === FormState.DEFAULT) ? 'Delete' : 'Cancel'}</button>
        ${(state === FormState.DEFAULT) ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">

        ${allPointOffers.length && showOffers(allPointOffers, offers) || ''}

        ${Object.keys(destinationInfo).length && showDestination(destinationInfo) || ''}
      </section>
    </form>
  </li>`;
};

export default class PointEditView extends SmartView {
  #point = {};
  #state = null;
  #startDatepicker = null;
  #endDatepicker = null;

  constructor(point, state) {
    super();
    this.#point = point;
    this.#state = state;
    this._data = PointEditView.parsePointToData(point);

    this.#setInnerHandlers();
    this.#setStartDatepicker();
  }

  get template() {
    return createPointTemplate(this._data, this.#state);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  // setEditButtonClickHandler = (callback) => {
  //   this._callback.editButtonClick = callback;
  //   this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editButtonClickHandler);
  // }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  // #editButtonClickHandler = () => {
  //   this._callback.editButtonClick();
  // }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(PointEditView.parseDataToPoint(this._data));
  }

  static parsePointToData = (point) => (
    {...point}
  );

  static parseDataToPoint = (data) => (
    {...data}
  );

  #destinationChangeHandler = (evt) => {
    const destination = getDestination(evt.target.value, ALL_DESTINATIONS);
    this.updateData({
      destination,
    });
  }

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      pointType: evt.target.value,
    });
  }

  #setStartDatepicker = () => {
    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateStart,
        onChange: this.#pointDateStartChangeHandler,
      },
    );
  }

  #setEndDatepicker = () => {
    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }

    this.#endDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateEnd,
        onChange: this.#pointDateEndChangeHandler,
        minDate: this._data.dateStart,
      },
    );
  }

  #pointDateStartChangeHandler = ([userDate]) => {
    this.updateData({
      dateStart: userDate,
    });
  }

  #pointDateEndChangeHandler = ([userDate]) => {
    this.updateData({
      dateEnd: userDate,
    });
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    // this.element.querySelector('.event__details').addEventListener('click', this.#offersChangeHandler);
  }
}
