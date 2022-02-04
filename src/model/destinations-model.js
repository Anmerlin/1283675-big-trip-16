import AbstractObservable from '../helpers/abstract-observable.js';

export default class DestinationsModel extends AbstractObservable {
  #destinations = [];

  get destinations() {
    return this.#destinations;
  }

  setDestinations = (destinations) => {
    this.#destinations = destinations;
  }
}
