import AbstractObservable from '../helpers/abstract-observable.js';
import { FilterType } from '../helpers/consts.js';

export default class FilterModel extends AbstractObservable {
  #filter = FilterType.DEFAULT;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
