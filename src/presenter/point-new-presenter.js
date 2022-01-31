import { nanoid } from 'nanoid';
import { FormState, NEW_POINT, RenderingLocation, UserAction, UpdateType } from '../helpers/consts.js';
import { remove, render } from '../helpers/render.js';
import { isEscEvent } from '../helpers/helpers.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;

  #point = NEW_POINT;
  #formState = FormState.ADD;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = () => {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView(this.#point, this.#formState);
    this.#pointEditComponent.setRangeDatepicker();
    this.#pointEditComponent.setPriceChangeHandler();
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setButtonDeleteClickHandler(this.#handleButtonDeleteClick);

    render(this.#pointListContainer, this.#pointEditComponent, RenderingLocation.AFTER_BEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    remove(this.#pointEditComponent);
    this.#pointEditComponent.removeRangeDatepicker();
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  }

  #handleButtonDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
      // document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }
}
