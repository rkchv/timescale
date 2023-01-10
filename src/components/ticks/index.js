/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { round, hoursOnScale } from '../../core/utils/';

class Ticks {
  element = null;

  constructor({ data = {}, step = 2, perHour = 4 }, observer) {
    this.hours = hoursOnScale(data);
    this.perHour = perHour;
    this.step = step;
    this.observer = observer;
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

  update(level) {
    this.step = 1;
    if (level > 8) {
      this.perHour = 16;
    }
    this.element.innerHTML = this.template;
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
}

export default connectToObserver(Ticks);
