import { FormState, NEW_POINT, RenderingLocation, UserAction, UpdateType } from '../helpers/consts.js';
import { remove, render } from '../helpers/render.js';
import { isEscEvent } from '../helpers/helpers.js';
import PointEditView from '../view/point-edit-view.js';

export default class PointNewPresenter {
  #pointListContainer = null;
  #changeData = null;
  #pointEditComponent = null;
  #destroyCallback = null;

  #point = NEW_POINT;
  #formState = FormState.ADD;

  constructor(pointListContainer, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new PointEditView(this.#point, this.#formState);
    this.#pointEditComponent.setRangeDatepicker();
    this.#pointEditComponent.setPriceChangeHandler();
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setButtonDeleteClickHandler(this.#handleButtonCancelClick);

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

    if(this.#destroyCallback !== null) {
      this.#destroyCallback();
    }

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleButtonCancelClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }
}
