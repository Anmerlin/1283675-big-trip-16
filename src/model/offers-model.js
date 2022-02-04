import AbstractObservable from '../helpers/abstract-observable.js';

export default class OffersModel extends AbstractObservable {
  #offers = [];

  get offers() {
    return this.#offers;
  }

  setOffers = (offers) => {
    this.#offers = offers;
  }
}
