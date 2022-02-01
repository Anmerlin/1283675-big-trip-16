import { POINT_COUNT, RenderingLocation, FilterType, NavigationItem, UpdateType } from './helpers/consts.js';
import { sortByKey } from './helpers/helpers.js';
import { render, remove } from './helpers/render.js';
// import { hidePseudoElement, showPseudoElement } from './helpers/common.js';
import { generatePoints } from './mock/point.js';
import TripInfoView from './view/info-view.js';
import NavigationView from './view/navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

let statisticComponent = null;

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const staticticContainerElement = mainElement.querySelector('.page-body__container');
// const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsTrip = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateStart', true));

const pointsModel = new PointsModel();
pointsModel.points = pointsTrip;

const filterModel = new FilterModel();

const navigationComponent = new NavigationView();

const renderSummaryInfoTrip = (points) => {
  render(navigationElement, navigationComponent);

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderingLocation.AFTER_BEGIN);
  }
};

const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);

renderSummaryInfoTrip(pointsTrip);
filterPresenter.init();
tripPresenter.init();

const handlePointNewFormClose = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = false;
};

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
});

const handleNavigationClick = (navigationItem) => {
  switch (navigationItem) {
    case NavigationItem.TABLE:
      tripPresenter.init();
      remove(statisticComponent);
      document.querySelector('.trip-main__event-add-btn').disabled = false;
      [...document.querySelectorAll('.trip-filters__filter-input')].map((input) => { input.disabled = false; });
      break;
    case NavigationItem.STATS:
      tripPresenter.destroy();
      statisticComponent = new StatisticsView(pointsModel.points);
      render(staticticContainerElement, statisticComponent);
      document.querySelector('.trip-main__event-add-btn').disabled = true;
      [...document.querySelectorAll('.trip-filters__filter-input')].map((input) => { input.disabled = true; });
      break;
  }
};

navigationComponent.setNavigationClickHandler(handleNavigationClick);
