import { SortType } from '../helpers/consts.js';
import { render } from '../helpers/render.js';
import { updatePoint, sortByTime, sortByPrice } from '../helpers/common.js';
import SortingView from '../view/sorting-view.js';
import ListPointsView from '../view/list-points-view.js';
import MessageView from '../view/messages-view.js';
import PointPresenter from './point-presenter.js';

export default class TripPresenter {
  #tripContainer = null;

  #sortComponent = new SortingView();
  #listPointsComponent = new ListPointsView();
  #messageComponent = new MessageView();

  #tripPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedTripPoints = [];

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) =>  {
    this.#tripPoints = [...tripPoints];
    this.#sourcedTripPoints = [...tripPoints];

    this.#renderSort();
    render(this.#tripContainer, this.#listPointsComponent);

    this.#renderTrip(this.#tripPoints);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updatePoint(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updatePoint(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.TIME:
        this.#tripPoints.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // if (this.#currentSortType === sortType) {
    //   return;
    // }

    this.#sortPoints(sortType);
    this.#clearTrip();
    this.#renderTrip();
  }

  #clearTrip = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listPointsComponent, this.#handlePointChange, this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#messageComponent);
  }

  #renderTrip = () => {
    if (!this.#tripPoints.length) {
      this.#renderNoPoints();
      return;
    }

    this.#tripPoints.forEach((point) => this.#renderPoint(point));
  }
}
