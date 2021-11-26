import { RenderingLocation } from './consts.js';

const renderTemplate = (container, template, position = RenderingLocation.BEFORE_END) => {
  container.insertAdjacentHTML(position, template);
};

export { renderTemplate };
