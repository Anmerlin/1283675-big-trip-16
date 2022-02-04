import { FilterType, UpdateType } from '../helpers/consts.js';
import { filter } from '../helpers/common.js';
import { render, replace, remove } from '../helpers/render.js';
import FilterView from '../view/filter-view.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
  }

  get filters() {
    return [
      {
        type: FilterType.DEFAULT,
        name: 'everything',
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
      },
      {
        type: FilterType.PAST,
        name: 'past',
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

    const points = this.#pointsModel.points;
    const filterItems = this.#filterComponent.element.querySelectorAll('.trip-filters__filter-input');

    [...filterItems]
      .map((filterItem) => {
        const filteredPoints = filter[filterItem.value](points);
        if (!filteredPoints.length) {
          filterItem.disabled = true;
        }
      });
  }

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.DEFAULT);
  }

  disableFilters = () => {
    const filters = this.#filterComponent.element.querySelectorAll('.trip-filters__filter-input');
    [...filters].map((input) => { input.disabled = true; });
  }

  enableFilters = () => {
    const filters = this.#filterComponent.element.querySelectorAll('.trip-filters__filter-input');
    [...filters].map((input) => { input.disabled = false; });
  }

  #handleModelEvent = () => {
    this.init();
  }

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

}
