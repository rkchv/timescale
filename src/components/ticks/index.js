/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { round } from '../../core/utils/';

class Ticks {
  element = null;

  constructor({ hours = 24, step = 2, perHour = 4 }, observer) {
    this.hours = hours;
    this.perHour = perHour;
    this.step = step;
    this.observer = observer;
    this.init();
  }

  init() {
    this.render();
    // this.initEventListeners();
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  initEventListeners() {}

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

  //
}

export default connectToObserver(Ticks);