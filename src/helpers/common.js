import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { DESTINATIONS_COUNT, FilterType } from '../helpers/consts.js';
import { sortByKey } from '../helpers/helpers.js';

dayjs.extend(durationPlugin);

const Messages = {
  [FilterType.DEFAULT]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const filter = {
  [FilterType.DEFAULT]: (points) => points.filter((point) => point === point),
  [FilterType.FUTURE]: (points) => points.filter((point) => point.dateStart >= dayjs() || point.dateStart < dayjs() & dayjs() < point.dateEnd),
  [FilterType.PAST]: (points) => points.filter((point) => (point.dateEnd < dayjs()) || point.dateStart < dayjs() & dayjs() < point.dateEnd),
};

const getPointTimeDuration = (point) => (dayjs(point.dateEnd)).diff(dayjs(point.dateStart));

const formatDuration = (time) => {
  const durationObject = dayjs.duration(time);
  return durationObject.format(`${!durationObject.days() ? '' : 'DD[D]'} ${!durationObject.hours() && !durationObject.days()  ? '' : 'HH[H]'} mm[M]`);
};

const calculateDuration = (point) => {
  const differenceInMinutes = getPointTimeDuration(point);
  return formatDuration(differenceInMinutes);
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
  const sortedByDateFrom = points.slice().sort((a, b) => a.dateStart - b.dateStart);
  const sortedByDateTo = points.slice().sort((a, b) => a.dateEnd - b.dateEnd);
  const startDateRaw = dayjs(sortedByDateFrom[0].dateStart);
  const endDateRaw = dayjs([...sortedByDateTo].pop().dateEnd);
  const startDate = dayjs(startDateRaw).format('MMM DD');
  const endDate = (
    dayjs(startDateRaw).month() === dayjs(endDateRaw).month() ?
      dayjs(endDateRaw).format('DD') : dayjs(endDateRaw).format('MMM DD')
  );
  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

const getTripRoute = (points) => (
  (points.length <= DESTINATIONS_COUNT) ?
    points.map((point) => point.destination.name).join(' &mdash; ') :
    `${points[0].destination.name} &mdash; ... &mdash; ${[...points].pop().destination.name}`
);

const getTripCost = (points) => (
  points.reduce((totalSum, point) => (
    totalSum + point.basePrice + point.offersPoint.reduce((sum, offer) => sum + offer.price, 0)
  ), 0)
);

const hidePseudoElement = () => {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'no-pseudo';
  styleSheet.innerHTML = '*:after {content: none !important; display: none !important;}';
  document.body.appendChild (styleSheet);
};

const showPseudoElement = () => {
  const sheetToBeRemoved = document.querySelector('#no-pseudo');
  const sheetParent = sheetToBeRemoved.parentNode;
  sheetParent.removeChild(sheetToBeRemoved);
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB);

const sortByTime = (pointA, pointB) => getPointTimeDuration(pointB) - getPointTimeDuration(pointA);

const sortByPrice = sortByKey('basePrice');

const filterOutFuture = (point) => point.dateStart >= dayjs();

const fiterOutPast = (point) => (point.dateStart < dayjs()) || (point.dateStart > dayjs() > point.dateEnd);

const getUniqueMarkupName = (title) => title.split(' ').slice(-2).join('-').toLowerCase();

export { getPointTimeDuration, calculateDuration, showPointDataHelper, getTravelTime, getTripRoute, getTripCost, hidePseudoElement, showPseudoElement, isDatesEqual, sortByTime, sortByPrice, filterOutFuture, fiterOutPast, Messages, filter, formatDuration, getUniqueMarkupName };
