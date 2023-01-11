/**
 * @format
 */

import { createElement } from '../../core/dom/';
import { round } from '../../core/utils/';

class Cursor {
  $element;

  constructor({ x = 0 }) {
    this.x = x;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    let template = this.template;
    this.$element = createElement(template);
  }

  get template() {
    return `<div class="timescale-cursor"></div>`;
  }

  set(to) {
    this.x = to;
    this.$element.style.opacity = 1;
    this.$element.style.left = `${this.x}%`;
  }

  move(to) {
    this.$element.style.opacity = 1;
    this.$element.style.left = `${this.x + to}%`;
  }

  reset(to) {
    this.x = to;
    this.$element.style.opacity = 0;
    this.$element.style.left = `${this.x}%`;
  }
}

export default Cursor;
