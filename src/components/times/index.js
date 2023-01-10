/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import {
  secToTime,
  round,
  getTranslate,
  hoursOnScale,
} from '../../core/utils/';

class Times {
  element = null;

  constructor({ data = {}, step = 2 }, observer) {
    this.hours = hoursOnScale(data);
    this.step = step;
    this.observer = observer;

    this.init();
  }

  init() {
    this.render();
    this.bindings();
    this.initEventListeners();
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

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

  update(level) {
    this.step = 2 / level;
    this.element.innerHTML = this.template;
  }

  calcLeft(index) {
    return round((100 / this.count) * index);
  }

  calcTimeLabel(index) {
    let labelsPerDay = 24 / this.step;

    if (index === 0 || index % labelsPerDay === 0) {
      return `00:00`;
    }

    if (index / labelsPerDay > 1) {
      let rest = index % labelsPerDay;
      let seconds = rest * this.step * 3600;
      return secToTime(seconds).slice(0, -3);
    }

    let seconds = index * this.step * 3600;

    return secToTime(seconds).slice(0, -3);
  }

  get count() {
    return this.hours / this.step;
  }

  bindings() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  initEventListeners() {
    this.element.addEventListener('mousedown', this.onMouseDown);
    this.element.addEventListener('mouseup', this.onMouseUp);
    this.element.addEventListener('dragstart', () => false);
  }

  onMouseDown(e) {
    this.x = (getTranslate(this.scale)[0] / this.width) * 100;
    this.translateFrom = e.clientX;
    this.element.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    let shift = ((e.clientX - this.translateFrom) / this.width) * 100;
    let x = this.x + shift;

    if (x !== this.tranlateTo && x <= 0 && x >= -this.limit) {
      this.tranlateTo = x;
    }

    if (x <= -this.limit) {
      this.tranlateTo = -this.limit;
    }

    if (x >= 0) {
      this.tranlateTo = 0;
    }

    this.observer.dispatchEvent({ type: 'move', payload: this.tranlateTo });
  }

  onMouseUp() {
    this.x = this.tranlateTo;
    this.element.removeEventListener('mousemove', this.onMouseMove);
  }

  get width() {
    return this.scale.getBoundingClientRect().width;
  }

  get rootWidth() {
    return this.root.getBoundingClientRect().width;
  }

  get root() {
    return this.element.closest('.timescale');
  }

  get scale() {
    return this.element.closest('.timescale-scale');
  }

  get limit() {
    return ((this.width - this.rootWidth) / this.width) * 100;
  }
}

export default connectToObserver(Times);
