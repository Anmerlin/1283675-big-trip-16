import AbstractView from '../view/abstract-view.js';
import { RenderingLocation } from './consts.js';

const render = (container, element, position = RenderingLocation.BEFORE_END) => {
  const parent = container instanceof AbstractView ? container.element : container;
  const child = element instanceof AbstractView ? element.element : element;

  switch (position) {
    case RenderingLocation.BEFORE_BEGIN:
      parent.before(child);
      break;
    case RenderingLocation.AFTER_BEGIN:
      parent.prepend(child);
      break;
    case RenderingLocation.AFTER_END:
      parent.after(child);
      break;
    default:
      parent.append(child);
      break;
  }
};

const createElement = (template) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = template;

  return wrapper.firstChild;
};

const replace = (newElement, oldElement) => {
  if (newElement === null || oldElement === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  const newChild = newElement instanceof AbstractView ? newElement.element : newElement;
  const oldChild = oldElement instanceof AbstractView ? oldElement.element : oldElement;

  const parent = oldChild.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newChild, oldChild);
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
};

export { render, createElement, replace, remove };
