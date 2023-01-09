/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { secToTime, round } from '../../core/utils/';

class Times {
  element = null;

  constructor({ hours = 24, step = 2 }, observer) {
    this.hours = hours;
    this.step = step;
    this._x = 0;
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
    this.element.addEventListener('dragstart', () => false);
    this.element.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e) {
    this.moveFrom = e.clientX;
    this.element.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    let shift = ((e.clientX - this.moveFrom) / this.width) * 100;
    let x = this._x + shift;

    if (x !== this.moveTo && x <= 0 && x >= -this.limit) {
      this.moveTo = x;
    }

    if (x <= -this.limit) {
      this.moveTo = -this.limit;
    }

    if (x >= 0) {
      this.moveTo = 0;
    }

    this.dispatchEvent(this.moveTo);
  }

  onMouseUp() {
    this._x = this.moveTo;
    this.element.removeEventListener('mousemove', this.onMouseMove);
  }

  get width() {
    return this.element.getBoundingClientRect().width;
  }

  get rootWidth() {
    let root = this.element.closest('.timescale');
    return root.getBoundingClientRect().width;
  }

  get limit() {
    return round(((this.width - this.rootWidth) / this.width) * 100);
  }

  dispatchEvent(position) {
    this.observer.dispatchEvent({ type: 'move', payload: position });
  }
}

export default connectToObserver(Times);
