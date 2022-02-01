import { FilterType, SortType, UpdateType, UserAction } from '../helpers/consts.js';
import { render, remove } from '../helpers/render.js';
import { filter, sortByTime, sortByPrice } from '../helpers/common.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import MessageView from '../view/messages-view.js';
import PointPresenter from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #listPointsComponent = new ListPointsView();
  #sortComponent = null;
  #messageComponent = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.DEFAULT;

  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#listPointsComponent, this.#handleViewAction);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
    }

    return filteredPoints;
  }

  init = () => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderTrip();
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);

    this.#pointNewPresenter.init(callback);
    document.querySelector('.trip-main__event-add-btn').disabled = true;
  }

  destroy = () => {
    this.#clearTrip({resetSortType: true});

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  }

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType,update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  }

  #clearTrip = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#listPointsComponent);
    if(this.#messageComponent) {
      remove(this.#messageComponent);
    }
    remove(this.#sortComponent);

    if(resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderSort = () => {
    if (this.#sortComponent !== null) {
      this.#sortComponent = null;
    }

    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#tripContainer, this.#sortComponent);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listPointsComponent, this.#handleViewAction, this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderNoPoints = () => {
    this.#messageComponent = new MessageView(this.#filterType);
    render(this.#tripContainer, this.#messageComponent);
  }

  #renderList = () => {
    render(this.#tripContainer, this.#listPointsComponent);
  }

  #renderTrip = () => {
    const points = this.points;

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderList();
    points.forEach((point) => this.#renderPoint(point));
  }
}
