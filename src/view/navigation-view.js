import { NavigationItem } from '../helpers/consts.js';
import AbstractView from './abstract-view.js';

const createNavigationTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-navigation-item="${NavigationItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-navigation-item="${NavigationItem.STATS}">Stats</a>
  </nav>`
);

export default class NavigationView extends AbstractView {
  constructor(navigationItem) {
    super();

    this._navigationItem = navigationItem;
  }

  get template() {
    return createNavigationTemplate();
  }

  setNavigationClickHandler = (callback) => {
    this._callback.navigationClick = callback;
    this.element.addEventListener('click', this.#navigationClickHandler);
  }

  setNavigationItem = (navigationItem) => {
    const selectedItem = this.element.querySelector(`[data-navigation-item=${navigationItem}]`);

    if (selectedItem !== null) {
      selectedItem.classList.toggle('trip-tabs__btn--active');
    }
  }

  #navigationClickHandler = (evt) => {
    evt.preventDefault();
    const selectedItem = evt.target.dataset.navigationItem;

    if (evt.target.tagName !== 'A') {
      return;
    }

    if(selectedItem === this._navigationItem) {
      return;
    }

    this._navigationItem = selectedItem;
    const items =  this.element.querySelectorAll('.trip-tabs__btn');
    [...items].map((item) => item.classList.toggle('trip-tabs__btn--active'));

    this._callback.navigationClick(selectedItem);
  }
}
