import { POINT_COUNT, RenderingLocation } from './helpers/consts.js';
import { sortByKey } from './helpers/helpers.js';
import { render } from './helpers/render.js';
import { getFilter } from './helpers/common.js';
import { generatePoints } from './mock/point.js';
import TripInfoView from './view/info-view.js';
import NavigationView from './view/navigation-view.js';
import FilterView from './view/filters-view.js';
import TripPresenter from './presenter/trip-presenter.js';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

const pointsTrip = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateStart'));

const renderSummaryInfo = (points) => {
  const filterComponent = new FilterView(points);

  render(navigationElement, new NavigationView());

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderingLocation.AFTER_BEGIN);
  }

  filterComponent.setFilterTypeChangeHandler((evt) => points.filter(getFilter[evt.target.value]));

  render(tripFilterElement, filterComponent);
};

const tripPresenter = new TripPresenter(tripEventsElement);

renderSummaryInfo(pointsTrip);
tripPresenter.init(pointsTrip);
