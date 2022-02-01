import { Mode, FormState, UpdateType, UserAction } from '../helpers/consts.js';
import { isEscEvent } from '../helpers/helpers.js';
import { render, replace, remove } from '../helpers/render.js';
import { isDatesEqual } from '../helpers/common.js';
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
    this.#pointComponent.setButtonEditClickHandler(this.#handleButtonEditClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setButtonDeleteClickHandler(this.#handleButtonDeleteClick);
    this.#pointEditComponent.setButtonEditClickHandler(this.#handleButtonPointClick);
    this.#pointEditComponent.setPriceChangeHandler();

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
    this.#pointEditComponent.setRangeDatepicker();
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#pointEditComponent.removeRangeDatepicker();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #handleButtonEditClick = () => {
    this.#replacePointToEditForm();
  }

  #handleButtonPointClick = () => {
    this.#replaceEditFormToPoint();
  }

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
    !isDatesEqual(this.#point.dateStart, update.dateStart) ||
    !isDatesEqual(this.#point.dateEnd, update.dateEnd);

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );

    this.#replaceEditFormToPoint();
  }

  #handleButtonDeleteClick  = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleFavoriteButtonClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  }
}
