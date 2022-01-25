import dayjs from 'dayjs';
import { DESTINATIONS_COUNT } from '../helpers/consts.js';
import { showTwoDigits } from '../helpers/helpers.js';

const messages = {
  'Everything': 'Click New Event to create your first point',
  'Past': 'There are no past events now',
  'Future': 'There are no future events now',
};

const getFilter = {
  everything: (point) => point === point,
  future: (point) => point.dateStart >= dayjs(),
  past: (point) => (point.dateStart < dayjs()) || (point.dateStart > dayjs() > point.dateEnd),
};

const calculateDuration = (start, end) => {
  const differenceInMinutes = (dayjs(end)).diff(dayjs(start), 'minutes');
  const hours = Math.floor(differenceInMinutes / 60);
  const minutes = differenceInMinutes - (hours * 60);
  const days = Math.floor(hours / 24);

  return `${(days !== 0) ? `${showTwoDigits(days)}D` : ''} ${(hours !== 0) ? `${showTwoDigits(hours)}H` : ''} ${showTwoDigits(minutes)}M`;
};

const showPointDataHelper = (dateStart, dateEnd) => {
  const dateEvent = dayjs(dateStart).format('YYYY-MM-DD');
  const shortDateEvent = dayjs(dateStart).format('MMM DD');

  const timeStart = dayjs(dateStart).format('YYYY-MM-DD[T]HH:mm');
  const shortTimeStart = dayjs(dateStart).format('HH:mm');

  const timeEnd = dayjs(dateEnd).format('YYYY-MM-DD[T]HH:mm');
  const shortTimeEnd = dayjs(dateEnd).format('HH:mm');

  return [dateEvent, shortDateEvent, timeStart, shortTimeStart, timeEnd, shortTimeEnd];
};

const getTravelTime = (points) => {
  const dateFromRaw = dayjs(points[0].dateStart);
  const dateToRaw = dayjs([...points].pop().dateEnd);
  const dateFrom = dayjs(dateFromRaw).format('MMM DD');
  const dateTo = (
    dayjs(dateFromRaw).month() === dayjs(dateToRaw).month() ?
      dayjs(dateToRaw).format('DD') : dayjs(dateToRaw).format('MMM DD')
  );
  return `${dateFrom}&nbsp;&mdash;&nbsp;${dateTo}`;
};

const getTripRoute = (points) => (
  (points.length <= DESTINATIONS_COUNT) ?
    points.map((point) => point.destination.name).join(' &mdash; ') :
    `${points[0].destination.name} &mdash; ... &mdash; ${[...points].pop().destination.name}`
);

const getTripCost = (points) => (
  points.reduce((totalSum, point) => (
    totalSum + point.basePrice + point.offers.reduce((sum, offer) => sum + offer.price, 0)
  ), 0)
);

const updatePoint = (points, update) => {
  const index = points.findIndex((point) => point.id === update.id);

  if (index === -1) {
    return points;
  }

  return [
    ...points.slice(0, index),
    update,
    ...points.slice(index + 1),
  ];
};

const showMessage = (filterState) => messages[filterState];

export { getFilter, calculateDuration, showPointDataHelper, getTravelTime, getTripRoute, getTripCost, updatePoint, showMessage };
