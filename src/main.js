import { POINT_COUNT, RenderingLocation } from './helpers/consts.js';
import { sortByKey } from './helpers/helpers.js';
import { render } from './helpers/render.js';
import { generatePoints } from './mock/point.js';
import TripInfoView from './view/info-view.js';
import NavigationView from './view/navigation-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

const pointsTrip = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateStart', true));

const pointsModel = new PointsModel();
pointsModel.points = pointsTrip;

const filterModel = new FilterModel();

const renderSummaryInfoTrip = (points) => {
  render(navigationElement, new NavigationView());

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderingLocation.AFTER_BEGIN);
  }
};

const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);

renderSummaryInfoTrip(pointsTrip);
filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
