import { Mode, FormState } from '../helpers/consts.js';
import { isEscEvent } from '../helpers/helpers.js';
import { render, replace, remove } from '../helpers/render.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;
  #formState = FormState.DEFAULT;

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point);
    this.#pointEditComponent = new PointEditView(point, this.#formState);

    this.#pointComponent.setFavoriteButtonClickHandler(this.#handleFavoriteButtonClick);
    this.#pointComponent.setEditButtonClickHandler(this.#handleEditButtonClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    // this.#pointEditComponent.setEditButtonClickHandler(this.#handleButtonEditClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointListContainer, this.#pointComponent);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
      // document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  #handleEditButtonClick = () => {
    this.#replacePointToEditForm();
  }

  // #handleButtonEditClick = () => {
  //   this.#replaceEditFormToPoint();
  // }

  #handleFormSubmit = (point) => {
    this.#changeData(point);
    this.#replaceEditFormToPoint();
  }

  #handleFavoriteButtonClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  }
}
