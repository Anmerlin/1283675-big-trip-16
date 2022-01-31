import dayjs from 'dayjs';
import { DESTINATIONS_COUNT, FilterType } from '../helpers/consts.js';
import { showTwoDigits, sortByKey } from '../helpers/helpers.js';

const Messages = {
  [FilterType.DEFAULT]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const filter = {
  [FilterType.DEFAULT]: (points) => points.filter((point) => point === point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateStart >= dayjs() || point.dateStart < dayjs() & dayjs() < point.dateEnd),
  [FilterType.PAST]: (points) => points.filter((point) => (point.dateStart < dayjs()) || point.dateStart < dayjs() & dayjs() < point.dateEnd),
};

const getPointTimeDuration = (point) => (dayjs(point.dateEnd)).diff(dayjs(point.dateStart), 'minutes');

const calculateDuration = (point) => {
  const differenceInMinutes = getPointTimeDuration(point);
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

//const sortByDay = sortByKey('dateStart', true);

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB);

const sortByTime = (pointA, pointB) => getPointTimeDuration(pointB) - getPointTimeDuration(pointA);

const sortByPrice = sortByKey('basePrice');

// const filterOutEverything = (point) => point === point;

const filterOutFuture = (point) => point.dateStart >= dayjs();

const fiterOutPast = (point) => (point.dateStart < dayjs()) || (point.dateStart > dayjs() > point.dateEnd);

export { calculateDuration, showPointDataHelper, getTravelTime, getTripRoute, getTripCost, isDatesEqual, sortByTime, sortByPrice, filterOutFuture, fiterOutPast, Messages, filter};
