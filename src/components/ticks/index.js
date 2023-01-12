/**
 * @format
 */

import { createElement } from '../../core/dom';
import { round, hoursOnScale } from '../../core/utils/';

class Ticks {
  _data;
  _perHour;
  _step;
  $element;

  constructor({ data = {}, step = 2, perHour = 4 }) {
    this.value = data;
    this._perHour = perHour;
    this._step = step;

    this.init();
  }

  set value(data) {
    this._data = Object.freeze(data);
  }

  get value() {
    return Object.freeze(this._data);
  }

  init() {
    this.render();
  }

  render() {
    let template = this.template;
    this.$element = createElement(template);
  }

  get template() {
    return `<div class="timescale-ticks">${this.ticks}</div>`;
  }

  get ticks() {
    let iterator = Array(this.count).fill(null);

    return [...iterator, null].reduce((template, item, index) => {
      let name = this.calcName(index);
      let left = this.calcLeft(index);

      template += `<div class="timescale-tick ${name}" style="left: ${left}%"></div>`;
      return template;
    }, '');
  }

  zoom(level) {
    this._step = 1;
    if (level > 8) {
      this._perHour = 16;
    }
    this.$element.innerHTML = this.ticks;
  }

  zoomReset() {
    this._step = 2;
    this._perHour = 4;
    this.$element.innerHTML = this.ticks;
  }

  update(data) {
    this.value = data;
    this.$element.innerHTML = this.ticks;
  }

  calcLeft(index) {
    let x = (100 / this.count) * index;
    return round(x);
  }

  calcName(index) {
    if (index % this.count === 0) {
      return 'big';
    }

    if (index % (24 * this._perHour) === 0) {
      return 'big shift';
    }

    if (index % (this._step * this._perHour) === 0) {
      return 'middle';
    }

    return 'small';
  }

  get count() {
    return this.hours * this._perHour;
  }

  get hours() {
    let data = { ...this.value };
    return hoursOnScale(data);
  }

  destroy() {
    this.value = null;
    this._perHour = null;
    this._step = null;
    this.$element.remove();
    this.$element = null;
  }
}

export default Ticks;
