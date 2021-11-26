import { POINT_COUNT, RenderingLocation } from './consts.js';
import { renderTemplate } from './helpers.js';
import { createTripInfoTemplate } from './view/info-view.js';
import { createNavigationTemplate } from './view/navigation-view.js';
import { createFiltersTemplate } from './view/filters-view.js';
import { createSortingTemplate } from './view/sorting-view.js';
import { createListPointsTemplate } from './view/list-points-view.js';
import { createEditingPointTemplate } from './view/point-edit-view.js';
import { createNewPointTemplate } from './view/point-create-view.js';
import { createShowPointTemplate } from './view/point-view.js';
import { createStatisticsTemplate } from './view/stats-view.js';
import { createMessagesTemplate } from './view/messages-view.js';

const headerContainer = document.querySelector('.page-header');
const headerTripInfo = headerContainer.querySelector('.trip-main');
const headerTripNavigation = headerContainer.querySelector('.trip-controls__navigation');
const headerTripFilter = headerContainer.querySelector('.trip-controls__filters');

const mainContainer = document.querySelector('.page-main');
const mainWrapper = mainContainer.querySelector('.page-body__container');
const mainTripEvents = mainContainer.querySelector('.trip-events');

renderTemplate(headerTripInfo, createTripInfoTemplate(), RenderingLocation.AFTERBEGIN);
renderTemplate(headerTripNavigation, createNavigationTemplate());
renderTemplate(headerTripFilter, createFiltersTemplate());
renderTemplate(mainTripEvents, createSortingTemplate());

renderTemplate(mainTripEvents, createListPointsTemplate());

const mainListTripEvents = mainTripEvents.querySelector('.trip-events__list');

renderTemplate(mainListTripEvents, createEditingPointTemplate(), RenderingLocation.AFTERBEGIN);
renderTemplate(mainListTripEvents, createNewPointTemplate());

for (let i = 0; i < POINT_COUNT; i++) {
  renderTemplate(mainListTripEvents, createShowPointTemplate());
}

renderTemplate(mainTripEvents, createMessagesTemplate());
renderTemplate(mainWrapper, createStatisticsTemplate());
