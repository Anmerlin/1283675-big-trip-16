import { UpdateType } from '../helpers/consts.js';
import AbstractObservable from '../helpers/abstract-observable.js';

export default class DestinationsModel extends AbstractObservable {
  #apiService = null;
  #destinations = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#apiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }
}
