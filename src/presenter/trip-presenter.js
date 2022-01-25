//import { POINT_COUNT, RenderingLocation } from '../helpers/consts.js';
import { render } from '../helpers/render.js';
import { updatePoint } from '../helpers/common.js';
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

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) =>  {
    this.#tripPoints = [...tripPoints];

    render(this.#tripContainer, this.#sortComponent);
    render(this.#tripContainer, this.#listPointsComponent);

    this.#renderTrip(this.#tripPoints);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updatePoint(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #clearTrip = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#listPointsComponent, this.#handlePointChange, this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderNoPoints = () => {
    render(this.#tripContainer, this.#messageComponent);
  }

  #renderList = () => {
    render(this._tripEventsContainer, this._eventsListComponent);
  }

  #renderTrip = (points) => {
    if (!points.length) {
      this.#renderNoPoints();
      return;
    }

    points.forEach((point) => this.#renderPoint(point));
  }
}
