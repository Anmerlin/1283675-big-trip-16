import dayjs from 'dayjs';
import { getBoolean, getRandomIntegerRangeInclusive, getArrayRandomLengthFromValues, getRandomValueFromArray } from '../helpers/helpers.js';

const TYPE_POINTS = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const DESTINATION_POINTS = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Barselona',
  'Berlin'
];

const DESCRIPTION_POINTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'
];

const OFFERS_TITLES = [
  'Add luggage',
  'Switch to comfort',
  'Add meal',
  'Choose seats',
  'Travel by train',
  'Order Uber',
  'Rent a car',
  'Add breakfast',
  'Book tickets',
  'Lunch in city',
];

const BASE_PRICE_MIN = 0;
const BASE_PRICE_MAX = 600;

const OFFER_PRICE_MIN = 5;
const OFFER_PRICE_MAX = 200;

const COUNT_SENTENCE_MIN = 1;
const COUNT_SENTENCE_MAX = 5;

const INTERVAL_DAYS_MAX = 7;
const INTERVAL_HOURS_MAX = 12;
const INTERVAL_MINUTES_MAX = 30;


const generateDestination = () => {
  const name = getRandomValueFromArray(DESTINATION_POINTS);
  const description = getArrayRandomLengthFromValues(DESCRIPTION_POINTS, getRandomIntegerRangeInclusive(COUNT_SENTENCE_MIN, COUNT_SENTENCE_MAX)).join(' ');
  const pictures = new Array(getRandomIntegerRangeInclusive(1,5)).fill().map(
    () => (
      {
        'src': `http://picsum.photos/248/152?r=${Math.random()}`,
        'description': `${name} ${getRandomValueFromArray(DESCRIPTION_POINTS)}`,
      }
    )
  );

  return {
    name,
    description,
    pictures,
  };
};


const generateDate = () => {
  const intervalBetweenDays = getRandomIntegerRangeInclusive(-INTERVAL_DAYS_MAX, INTERVAL_DAYS_MAX);
  const intervalBetweenHours = getRandomIntegerRangeInclusive(-INTERVAL_HOURS_MAX, INTERVAL_HOURS_MAX);
  const intervalBetweenMinutes = getRandomIntegerRangeInclusive(-INTERVAL_MINUTES_MAX, INTERVAL_MINUTES_MAX);

  return [
    dayjs().add(intervalBetweenDays, 'day').toDate(),
    dayjs().add(intervalBetweenDays, 'day').add(intervalBetweenHours, 'hour').add(intervalBetweenMinutes, 'minute').toDate(),
  ];
};

const generateOffers = () => TYPE_POINTS.map(
  (value) => (
    {
      'type': value,
      'offers': new Array(getRandomIntegerRangeInclusive(0, 5)).fill().map(
        () => (
          {
            'title': OFFERS_TITLES[getRandomIntegerRangeInclusive(0, OFFERS_TITLES.length - 1)],
            'price': getRandomIntegerRangeInclusive(OFFER_PRICE_MIN, OFFER_PRICE_MAX),
          }
        )
      ),
    }
  )
);

const allOffers = generateOffers();

const getAvailableOffers = (type, offers) => (offers.find((offer) => offer.type === type)).offers;

const getSelectedOffers = (type, offers) => {
  const availableOffers = getAvailableOffers(type, offers);
  return availableOffers.slice(0, getRandomIntegerRangeInclusive(0, availableOffers.length));
};

const pointsDataHelper = () => {
  const type = getRandomValueFromArray(TYPE_POINTS);
  const isFavorite = getBoolean(getRandomIntegerRangeInclusive());
  const dates = generateDate();
  const dateStart = Math.min(...dates);
  const dateEnd = Math.max(...dates);
  const basePrice = getRandomIntegerRangeInclusive(BASE_PRICE_MIN, BASE_PRICE_MAX);
  const destination = generateDestination();
  const offers = getSelectedOffers(type, allOffers);

  return [type, destination, dateStart, dateEnd, basePrice, offers, isFavorite];
};

const generatePoints = () => {
  const [type, destination, dateStart, dateEnd, basePrice, offers, isFavorite] = pointsDataHelper();

  return {
    id: 0,
    type,
    destination,
    dateStart,
    dateEnd,
    basePrice,
    offers,
    isFavorite,
  };
};

export { generatePoints, allOffers, getAvailableOffers };
