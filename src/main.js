import { POINT_COUNT, RenderingLocation } from './helpers/consts.js';
import { sortByKey, isEscEvent } from './helpers/helpers.js';
import { render, replace } from './helpers/render.js';
import { generatePoints } from './mock/point.js';
import TripInfoView from './view/info-view.js';
import NavigationView from './view/navigation-view.js';
import FilterView from './view/filters-view.js';
import SortingView from './view/sorting-view.js';
import ListPointsView from './view/list-points-view.js';
import PointEditView from './view/point-edit-view.js';
import PointView from './view/point-view.js';
import MessageView from './view/messages-view.js';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');

const pointsTrip = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateStart'));

const renderPoint = (containerElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new PointEditView(point, true);

  const replacePointToEditForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceEditFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscCloseEdit = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscCloseEdit);
    }
  };

  pointComponent.setEditButtonClickHandler(() => {
    replacePointToEditForm();
    document.addEventListener('keydown', onEscCloseEdit);
  });

  pointEditComponent.setFormSubmitHandler(() => {
    replaceEditFormToPoint();
    document.removeEventListener('keydown', onEscCloseEdit);
  });

  // pointEditComponent.setEditButtonClickHandler(() => {
  //   replaceEditFormToPoint();
  //   document.removeEventListener('keydown', onEscCloseEdit);
  // });

  render(containerElement, pointComponent);
};

const renderHeader = (points) => {
  const filterComponent = new FilterView(points);

  render(navigationElement, new NavigationView());

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderingLocation.AFTER_BEGIN);
  }

  render(tripFilterElement, filterComponent);
};

const renderBoard = (points) => {
  const pointsListComponent = new ListPointsView();

  render(tripEventsElement, new SortingView());
  render(tripEventsElement, pointsListComponent);

  if (!points.length) {
    render(tripEventsElement, new MessageView());
  } else {
    for (let i = 1; i < POINT_COUNT; i++) {
      renderPoint(pointsListComponent, points[i]);
    }
  }
};

renderHeader(pointsTrip);
renderBoard(pointsTrip);
