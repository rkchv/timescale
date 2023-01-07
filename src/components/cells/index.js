/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { colors } from '../../core/globals/';

import { createElement } from '../../core/dom';
import { secondsToDuration, getMsFromDate, round } from '../../core/utils/';

class Cells {
  element = null;

  constructor({ data = [], hours = 24 }, observer) {
    this.data = data;
    this.hours = hours;
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

  get template() {
    return `<div class="timescale-cells">${this.getCells()}</div>`;
  }

  initEventListeners() {}

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
    // let scaleWidth = this.root.clientWidth * this.offset;
    // return (scaleWidth * width) / 100 < 45
    //   ? 'timescale-cell float'
    //   : 'timescale-cell';
    return 'timescale-cell';
  }

  get totalHoursMs() {
    return this.hours * 3600 * 1000;
  }

  //
}

export default connectToObserver(Cells);
