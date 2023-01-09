/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom/';
import { round } from '../../core/utils/';

class Cursor {
  element;

  constructor({ hours = 24, position = 0 }, observer) {
    this.hours = hours;
    this.position = position;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  get template() {
    return `<div class="timescale-cursor"></div>`;
  }

  set(position) {
    this.position = position;
    this.element.style.opacity = 1;
    this.element.style.left = `${this.position}%`;
  }

  move(shift) {
    console.log(shift);
    this.element.style.opacity = 1;
    this.element.style.left = `${this.position + shift}%`;
  }
}

export default connectToObserver(Cursor);
