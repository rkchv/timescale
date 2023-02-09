/**
 * @format
 */

import { createElement } from '../../core/dom/';
import { round } from '../../core/utils/';

class Cursor {
  _x;
  $element;

  constructor({ x = 0 }) {
    this._x = x;
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

  set(to, opacity = 1) {
    this._x = Number(to);
    this.$element.style.opacity = opacity;
    this.$element.style.left = `${this._x}%`;
  }

  move(to) {
    let newPos = this._x + to
    this.$element.style.opacity = 1;
    this.$element.style.left = `${newPos}%`;
  }

  destroy() {
    this._x = null;
    this.$element.remove();
    this.$element = null;
  }
}

export default Cursor;
