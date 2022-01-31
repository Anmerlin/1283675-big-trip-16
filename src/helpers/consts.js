const POINT_COUNT = 20;

const DESTINATIONS_COUNT = 3;

const RenderingLocation = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const FilterType = {
  DEFAULT: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export { POINT_COUNT, DESTINATIONS_COUNT, RenderingLocation, Mode, SortType, FilterType };
