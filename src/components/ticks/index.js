/**
 * @format
 */

import { createElement } from '../../core/dom';
import { round, hoursOnScale } from '../../core/utils/';

class Ticks {
  element = null;

  constructor({ data = {}, step = 2, perHour = 4 }) {
    this.data = data;
    this.perHour = perHour;
    this.step = step;
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
    this.step = 1;
    if (level > 8) {
      this.perHour = 16;
    }
    this.element.innerHTML = this.ticks;
  }

  zoomReset() {
    this.step = 2;
    this.perHour = 4;
    this.element.innerHTML = this.ticks;
  }

  update(data) {
    this.data = data;
    this.element.innerHTML = this.ticks;
  }

  calcLeft(index) {
    let x = (100 / this.count) * index;
    return round(x);
  }

  calcName(index) {
    if (index % this.count === 0) {
      return 'big';
    }

    if (index % (24 * this.perHour) === 0) {
      return 'big shift';
    }

    if (index % (this.step * this.perHour) === 0) {
      return 'middle';
    }

    return 'small';
  }

  get count() {
    return this.hours * this.perHour;
  }

  get hours() {
    return hoursOnScale({ ...this.data });
  }
}

export default Ticks;
