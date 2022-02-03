import dayjs from 'dayjs';

const POINT_COUNT = 20;

const DESTINATIONS_COUNT = 3;

const RenderingLocation = {
  BEFORE_BEGIN: 'beforebegin',
  AFTER_BEGIN: 'afterbegin',
  BEFORE_END: 'beforeend',
  AFTER_END: 'afterend'
};

const FormState = {
  DEFAULT: 'EDIT',
  ADD: 'ADD',
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const NavigationItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

const NEW_POINT = {
  'type': '',
  'dateStart': dayjs(),
  'dateEnd': dayjs(),
  'destination': {
    'name': '',
    'description': '',
    'pictures': [],
  },
  'basePrice': '',
  'isFavorite': false,
  'offersPoint': [],
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const DataPath = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

const SHAKE_ANIMATION_TIMEOUT = 600;

export { POINT_COUNT, DESTINATIONS_COUNT, NEW_POINT, RenderingLocation, FormState, Mode, SortType, FilterType, UserAction, UpdateType, NavigationItem, Method, DataPath, SHAKE_ANIMATION_TIMEOUT };
