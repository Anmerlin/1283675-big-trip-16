import { RenderingLocation } from '../helpers/consts.js';
import { remove, render, replace } from '../helpers/render.js';
import TripInfoView from '../view/info-view.js';

export default class TripInfoPresenter {
  #points = null;
  #infoContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;

  constructor(infoContainer, pointsModel) {
    this.#infoContainer = infoContainer;
    this.#pointsModel = pointsModel;
  }

  init = () => {
    this.#points = this.#pointsModel.points;

    if (this.#points.length === 0) {
      if(this.#tripInfoComponent) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#renderTripInfoComponent();
  }

  #renderTripInfoComponent = () => {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView(this.#points);

    if (prevTripInfoComponent === null) {
      render(this.#infoContainer, this.#tripInfoComponent, RenderingLocation.AFTER_BEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
