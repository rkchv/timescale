/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { secondsToDuration, round } from '../../core/utils/';

class Times {
  element = null;

  constructor({ hours = 24, step = 2 }, observer) {
    this.hours = hours;
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
    return `<div class="timescale-times">${this.timeLabels}</div>`;
  }

  get timeLabels() {
    let iterator = Array(this.count).fill(null);

    return [...iterator, null].reduce((template, item, index) => {
      let left = this.calcLeft(index);
      let timeLabel = this.calcTimeLabel(index);

      template += `<div class="timescale-time" style="left: ${left}%">${timeLabel}</div>`;
      return template;
    }, '');
  }

  calcLeft(index) {
    let x = (100 / this.count) * index;
    return round(x);
  }

  calcTimeLabel(index) {
    let labelsPerDay = 24 / this.step;

    if (index === 0 || index % labelsPerDay === 0) {
      return `00:00`;
    }

    if (index / labelsPerDay > 1) {
      let rest = index % labelsPerDay;
      let seconds = rest * this.step * 3600;
      return secondsToDuration(seconds).slice(0, -3);
    }

    let seconds = index * this.step * 3600;

    return secondsToDuration(seconds).slice(0, -3);
  }

  get count() {
    return this.hours / this.step;
  }

  //
}

export default connectToObserver(Times);
