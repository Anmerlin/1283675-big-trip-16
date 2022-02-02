import { FilterType, NavigationItem, UpdateType } from './helpers/consts.js';
// import { sortByKey } from './helpers/helpers.js';
import { render, remove } from './helpers/render.js';
import { hidePseudoElement, showPseudoElement } from './helpers/common.js';
// import { generatePoints } from './mock/point.js';
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
const AUTHORIZATION = 'Basic qg50cx31iglrysd';

let statisticComponent = null;

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const mainContainerElement = mainElement.querySelector('.page-body__container');
const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const addNewPointButton = document.querySelector('.trip-main__event-add-btn');

// const pointsTrip = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateStart', true));


const pointsModel = new PointsModel(new ApiService(URI, AUTHORIZATION));
const offersModel = new OffersModel(new ApiService(URI, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new ApiService(URI, AUTHORIZATION));
// pointsModel.points = pointsTrip;
// const api = new ApiService(URI, AUTHORIZATION);

// const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const navigationComponent = new NavigationView();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);

const handlePointNewFormClose = () => {
  addNewPointButton.disabled = false;
};

addNewPointButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
});

const handleNavigationClick = (navigationItem) => {
  switch (navigationItem) {
    case NavigationItem.TABLE:
      filterPresenter.enableFilters();
      addNewPointButton.disabled = false;
      remove(statisticComponent);
      tripPresenter.init();
      showPseudoElement();
      break;
    case NavigationItem.STATS:
      filterPresenter.disableFilters();
      addNewPointButton.disabled = true;
      tripPresenter.destroy();
      statisticComponent = new StatisticsView(pointsModel.points);
      render(mainContainerElement, statisticComponent);
      hidePseudoElement();
      break;
  }
};

tripInfoPresenter.init();
filterPresenter.init();
tripPresenter.init();

pointsModel.init().finally(() => {
  render(navigationElement, navigationComponent);
  navigationComponent.setNavigationClickHandler(handleNavigationClick);
});

// api.getInitData()
//   .then(([points, offers, destinations]) => {
//     pointsModel.setPoints(UpdateType.INIT, points);
//     offersModel.offers = offers;
//     // console.log(destinations);
//     destinationsModel.destinations = destinations;
//     tripInfoPresenter.init();
//     render(navigationElement, navigationComponent);
//     navigationComponent.setMenuClickHandler(handleNavigationClick);
//   })
//   .catch(() => {
//     pointsModel.setPoints(UpdateType.INIT, []);
//     render(navigationElement, navigationComponent);
//     navigationComponent.setMenuClickHandler(handleNavigationClick);
//   });


