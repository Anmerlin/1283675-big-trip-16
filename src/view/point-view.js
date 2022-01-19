import dayjs from 'dayjs';
import { showTwoDigits } from '../helpers.js';

const calculateDuration = (start, end) => {
  const differenceInMinutes = (dayjs(end)).diff(dayjs(start), 'minutes');
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes - (hours * 60);
  const days = Math.floor(hours / 24);

  return `${(days !== 0) ? `${showTwoDigits(days)}D` : ''} ${(hours !== 0) ? `${showTwoDigits(hours)}H` : ''} ${showTwoDigits(minutes)}M`;
};

const showOffers = (offers) => ((offers.length !== 0) ? (`<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offers.map((offer) =>
    `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`).join('\n')}
  </ul>`) : '');

const showPointDataHelper = (dateStart, dateEnd) => {
  const dateEvent = dayjs(dateStart).format('YYYY-MM-DD');
  const shortDateEvent = dayjs(dateStart).format('MMM DD');

  const timeStart = dayjs(dateStart).format('YYYY-MM-DD[T]HH:mm');
  const shortTimeStart = dayjs(dateStart).format('HH:mm');

  const timeEnd = dayjs(dateEnd).format('YYYY-MM-DD[T]HH:mm');
  const shortTimeEnd = dayjs(dateEnd).format('HH:mm');

  return [dateEvent, shortDateEvent, timeStart, shortTimeStart, timeEnd, shortTimeEnd];
};

const createShowPointTemplate = (point) => {
  const { type, destination: {name}, dateStart, dateEnd, basePrice, offers, isFavorite } = point;
  const [dateEvent, shortDateEvent, timeStart, shortTimeStart, timeEnd, shortTimeEnd] = showPointDataHelper(dateStart, dateEnd);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateEvent}">${shortDateEvent}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${timeStart}">${shortTimeStart}</time>
        &mdash;
        <time class="event__end-time" datetime="${timeEnd}">${shortTimeEnd}</time>
      </p>
      <p class="event__duration">${calculateDuration(dateStart, dateEnd)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    ${showOffers(offers)}
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

export { createShowPointTemplate };
