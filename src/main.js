import { POINT_COUNT, RenderingLocation } from './consts.js';
import { renderTemplate } from './helpers.js';
import { createTripInfoTemplate } from './view/info-view.js';
import { createNavigationTemplate } from './view/navigation-view.js';
import { createFiltersTemplate } from './view/filters-view.js';
import { createSortingTemplate } from './view/sorting-view.js';
import { createListPointsTemplate } from './view/list-points-view.js';
import { createPointTemplate } from './view/point-edit-view.js';
import { createShowPointTemplate } from './view/point-view.js';
import { generatePoints } from './mock/point.js';
import { sortByKey } from './helpers.js';

const headerContainer = document.querySelector('.page-header');
const headerTripInfo = headerContainer.querySelector('.trip-main');
const headerTripNavigation = headerContainer.querySelector('.trip-controls__navigation');
const headerTripFilter = headerContainer.querySelector('.trip-controls__filters');

const mainContainer = document.querySelector('.page-main');
const mainTripEvents = mainContainer.querySelector('.trip-events');


const points = new Array(POINT_COUNT).fill().map(generatePoints).sort(sortByKey('dateStart'));

renderTemplate(headerTripInfo, createTripInfoTemplate(points), RenderingLocation.AFTER_BEGIN);
renderTemplate(headerTripNavigation, createNavigationTemplate());
renderTemplate(headerTripFilter, createFiltersTemplate());
renderTemplate(mainTripEvents, createSortingTemplate());

renderTemplate(mainTripEvents, createListPointsTemplate());

const mainListTripEvents = mainTripEvents.querySelector('.trip-events__list');

renderTemplate(mainListTripEvents, createPointTemplate(points[0]), RenderingLocation.AFTER_BEGIN);

for (let i = 1; i < POINT_COUNT; i++) {
  renderTemplate(mainListTripEvents, createShowPointTemplate(points[i]));
}
