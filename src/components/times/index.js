/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { secToTime, round, translation, hoursOnScale } from '../../core/utils/';

class Times {
  _data;
  _step;
  _x;
  _translateFrom;
  _tranlateTo;
  $element;

  constructor({ data = {}, step = 2 }, observer) {
    this.value = data;
    this._step = step;
    this.observer = observer;

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
    this._bind();
    this._initEventListeners();
  }

  render() {
    let template = this.template;
    this.$element = createElement(template);
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

  zoom(level) {
    this._step = 2 / level;
    this.$element.innerHTML = this.timeLabels;
  }

  zoomReset() {
    this._step = 2;
    this.$element.innerHTML = this.timeLabels;
  }

  update(data) {
    this.value = data;
    this.$element.innerHTML = this.timeLabels;
  }

  calcLeft(index) {
    return round((100 / this.count) * index);
  }

  calcTimeLabel(index) {
    let labelsPerDay = 24 / this._step;

    if (index === 0 || index % labelsPerDay === 0) {
      return `00:00`;
    }

    if (index / labelsPerDay > 1) {
      let rest = index % labelsPerDay;
      let seconds = rest * this._step * 3600;
      return secToTime(seconds).slice(0, -3);
    }

    let seconds = index * this._step * 3600;

    return secToTime(seconds).slice(0, -3);
  }

  get count() {
    return this.hours / this._step;
  }

  _bind() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  _initEventListeners() {
    this.$element.addEventListener('mousedown', this.onMouseDown);
    this.$element.addEventListener('dragstart', () => false);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(e) {
    this._x = (translation(this.$scale)[0] / this.scaleWidth) * 100;
    this._translateFrom = e.clientX;
    document.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(e) {
    let shift = ((e.clientX - this._translateFrom) / this.scaleWidth) * 100;
    let x = this._x + shift;

    if (x !== this._tranlateTo && x <= 0 && x >= -this.maxOffset) {
      this._tranlateTo = x;
    }

    if (x <= -this.maxOffset) {
      this._tranlateTo = -this.maxOffset;
    }

    if (x >= 0) {
      this._tranlateTo = 0;
    }

    this.observer.dispatchEvent({ type: 'move', payload: this._tranlateTo });
  }

  onMouseUp() {
    this._x = this._tranlateTo;
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  get $root() {
    return this.$element.closest('.timescale');
  }

  get $scale() {
    return this.$element.closest('.timescale-scale');
  }

  get rootWidth() {
    return this.$root.getBoundingClientRect().width;
  }

  get scaleWidth() {
    return this.$scale.getBoundingClientRect().width;
  }

  get maxOffset() {
    return ((this.scaleWidth - this.rootWidth) / this.scaleWidth) * 100;
  }

  get hours() {
    let data = { ...this.value };
    return hoursOnScale(data);
  }
}

export default connectToObserver(Times);
