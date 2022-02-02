import AbstractObservable from '../helpers/abstract-observable.js';

export default class DestinationsModel extends AbstractObservable {
  #destinations = [];

  set destinations(destinations) {
    this.#destinations = [...destinations];
  }

  get destinations() {
    return this.#destinations;
  }
}
