/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { colors } from '../../core/globals/';

import { createElement } from '../../core/dom';
import {
  secondsToDuration,
  getMsFromDate,
  round,
  getTranslate,
} from '../../core/utils/';

class Cells {
  element = null;
  _zoomLevel = 1;

  constructor({ data = [], hours = 24 }, observer) {
    this.data = data;
    this.hours = hours;
    this.observer = observer;
    this.map = new Map();
    this.init();
  }

  init() {
    this.render();
    this.initEventListeners();
    // this.initOffset = this.offset;
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  get template() {
    return `<div class="timescale-cells">${this.getCells()}</div>`;
  }

  getCells() {
    return this.data.reduce((template, { id, start, stop, type }, index) => {
      let left = this.calcLeft(start);
      let width = this.calcWidth(start, stop);
      let name = this.calcFloat(width);
      let duration = secondsToDuration(stop - start);

      template += `
        <div
          class="${name}"
          style="background-color: ${colors[type]}; left: ${left}%; width: ${width}%"
          data-id="${id}"
        >
          <span>${duration}</span>
        </div>
      `;

      return template;
    }, '');
  }

  calcWidth(start, stop) {
    let ms = (stop - start) * 1000;
    return round((ms / this.totalHoursMs) * 100);
  }

  calcLeft(start) {
    let startDate = new Date(start * 1000);
    return round((getMsFromDate(startDate) / this.totalHoursMs) * 100);
  }

  calcFloat(width) {
    // let width = this.root.clientWidth * this.offset;
    // return (width * width) / 100 < 45
    //   ? 'timescale-cell float'
    //   : 'timescale-cell';
    return 'timescale-cell';
  }

  get totalHoursMs() {
    return this.hours * 3600 * 1000;
  }

  initEventListeners() {
    this.element.addEventListener('click', this.onClick.bind(this));
    this.element.addEventListener('dblclick', this.onDoubleClick.bind(this));
  }

  onClick(e) {
    if (e.detail !== 1 || !e.target.dataset.id) return;
    this.timer = setTimeout(() => console.log('CELL CLICK'), 200);
  }

  onDoubleClick(e) {
    clearTimeout(this.timer);
    this.zoom(e);
  }

  zoom(e) {
    let width = this.widthPercent;
    let cursor = this.calcCursor(e.clientX);
    this._zoomLevel *= 2;

    let shift = -cursor + (100 - this.offset) / this._zoomLevel / 2;

    this.observer.dispatchEvent({ type: 'zoom', payload: { width, shift } });
  }

  calcCursor(x) {
    let cursor = ((x - this.elementOffset) / this.width) * 100;
    return round(cursor);
  }

  get offset() {
    if (this.map.get('offset')) {
      return round(this.map.get('offset'));
    }

    let value = ((this.width - this.rootWidth) / this.width) * 100;
    this.map.set('offset', value);
    return round(value);
  }

  get elementOffset() {
    return this.element.getBoundingClientRect().x;
  }

  get rootWidth() {
    return this.$root.getBoundingClientRect().width;
  }

  get width() {
    return this.element.getBoundingClientRect().width;
  }

  get widthPercent() {
    return round((this.width / this.rootWidth) * 100) * 2;
  }

  get $root() {
    return this.element.closest('.timescale');
  }

  //
}

export default connectToObserver(Cells);
