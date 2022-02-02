import PointsModel from '../model/points-model.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const DataPath = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get points() {
    return this.#load({url: DataPath.POINTS})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({url: DataPath.OFFERS})
      .then(ApiService.parseResponse);
  }

  get destination() {
    return this.#load({url: DataPath.DESTINATIONS})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this.#load({
      url: `${DataPath.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  addPoint = async (point) => {
    const response = await this.#load({
      url: DataPath.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deletePoint = async (point) => {
    const response = await this.#load({
      url: `${DataPath.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'date_from': point.dateStart instanceof Date ? point.dateStart.toISOString() : null,
      'date_to': point.dateEnd instanceof Date ? point.dateEnd.toISOString() : null,
      'base_price': point.basePrice,
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
