import AbstractObservable from '../helpers/abstract-observable.js';

export default class OffersModel extends AbstractObservable {
  #offers = [];

  set offers(offers) {
    this.#offers = [...offers];
  }

  get offers() {
    return this.#offers;
  }
}
