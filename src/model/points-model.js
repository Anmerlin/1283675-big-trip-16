import AbstractObservable from '../helpers/abstract-observable.js';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  setPoints = (updateType, points) => {
    this.#points = points.map(this.#adaptToClient);
    this._notify(updateType);
  }

  updatePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#apiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  addPoint = async (updateType, update) => {
    try {
      const response = await this.#apiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points
      ];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  deletePoint = async (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#apiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateStart: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateEnd: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      basePrice: point['base_price'],
      offersPoint: point['offers'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['offers'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
