import { POINT_COUNT, RenderingLocation } from './helpers/consts.js';
import { render, sortByKey } from './helpers/helpers.js';
import { generatePoints } from './mock/point.js';
import TripInfoView from './view/info-view.js';
import NavigationView from './view/navigation-view.js';
import FilterView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import ListPointsView from './view/list-points-view.js';
import PointCreateView from './view/point-edit-view.js';
import PointView from './view/point-view.js';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

const points = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateEnd'));

const renderPoint = (containerElement, point) => {
  const componentPoint = new PointView(point);
  const componentPointCreate = new PointCreateView(point, true);

  const replacePointToEditForm = () => {
    containerElement.replaceChild(componentPointCreate.getElement(), componentPoint.getElement());
  };

  const replaceEditFormToPoint = () => {
    containerElement.replaceChild(componentPoint.getElement(), componentPointCreate.getElement());
  };

  componentPoint.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => replacePointToEditForm());

  componentPointCreate.getElement().querySelector('form').addEventListener('submit', () => replaceEditFormToPoint());

  render(containerElement, componentPoint.getElement());
};

render(navigationElement, new NavigationView().getElement());

if (points.length !== 0) {
  render(tripMainElement, new TripInfoView(points).getElement(), RenderingLocation.AFTER_BEGIN);
}

render(tripFilterElement, new FilterView().getElement());
render(tripEventsElement, new SortingView().getElement());

const pointsListComponent = new ListPointsView();
render(tripEventsElement, pointsListComponent.getElement());

for (let i = 1; i < POINT_COUNT; i++) {
  renderPoint(pointsListComponent.getElement(), points[i]);
}
