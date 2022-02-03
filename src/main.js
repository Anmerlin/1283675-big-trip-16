import { FilterType, NavigationItem, UpdateType } from './helpers/consts.js';
import { render, remove } from './helpers/render.js';
import { toggleHiddenClass } from './helpers/common.js';
import NavigationView from './view/navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model.js';
import ApiService from './api/api-service.js';


const URI = 'https://16.ecmascript.pages.academy/big-trip';
const AUTHORIZATION = 'Basic qg50cx17iglrysd';

let statisticComponent = null;

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const mainContainerElement = mainElement.querySelector('.page-body__container');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel(new ApiService(URI, AUTHORIZATION));
const offersModel = new OffersModel(new ApiService(URI, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new ApiService(URI, AUTHORIZATION));
const filterModel = new FilterModel();

const navigationComponent = new NavigationView();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, offersModel, destinationsModel, filterModel);

const handlePointNewFormClose = () => {
  addNewPointButton.disabled = false;
};

const handleNavigationClick = (navigationItem) => {
  switch (navigationItem) {
    case NavigationItem.TABLE:
      filterPresenter.enableFilters();
      addNewPointButton.disabled = false;
      remove(statisticComponent);
      tripPresenter.init();
      toggleHiddenClass(tripEventsElement);
      break;
    case NavigationItem.STATS:
      filterPresenter.disableFilters();
      addNewPointButton.disabled = true;
      tripPresenter.destroy();
      statisticComponent = new StatisticsView(pointsModel.points);
      render(mainContainerElement, statisticComponent);
      toggleHiddenClass(tripEventsElement);
      break;
  }
};

const startApp = () => {
  tripInfoPresenter.init();
  filterPresenter.init();
  tripPresenter.init();

  offersModel.init();
  destinationsModel.init();
  pointsModel.init().finally(() => {
    render(navigationElement, navigationComponent);
    navigationComponent.setNavigationClickHandler(handleNavigationClick);
  });

  addNewPointButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    tripPresenter.destroy();
    filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
    tripPresenter.init();
    tripPresenter.createPoint(handlePointNewFormClose);
  });
};

startApp();
