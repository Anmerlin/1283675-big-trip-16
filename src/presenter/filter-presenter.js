import { FilterType } from '../helpers/consts.js';
import { render } from '../helpers/render.js';
import { filterOutFuture, fiterOutPast } from '../helpers/common.js';
import FilterView from '../view/filters-view.js';

export default class FilterPresenter {
  #filterContainer = null;

  #filterComponent = new FilterView();

  #tripPoints = [];
  #currentFilterType = FilterType.DEFAULT;
  #sourcedTripPoints = [];

  constructor(filterContainer) {
    this.#filterContainer = filterContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];
    this.#sourcedTripPoints = [...tripPoints];

    this.#renderFilter();
  }

  #filterPoints = (filterType) => {
    switch (filterType) {
      case FilterType.FUTURE:
        this.#tripPoints.filter(filterOutFuture);
        break;
      case FilterType.PAST:
        this.#tripPoints.filter(fiterOutPast);
        break;
      default:
        this.#tripPoints = [...this.#sourcedTripPoints];
    }

    this.#currentFilterType = filterType;
  }

    #handleFilterTypeChange = (filterType) => {
      this.#filterPoints(filterType);
      // this.#clearTrip();
      // this.#renderTrip();
    }

  #renderFilter = () => {
    render(this.#filterContainer, this.#filterComponent);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);
  }
}
