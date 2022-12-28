/**
 * @format
 */

import './style.scss';

import connectToObserver from './core/observer/connect';
import { createElement } from './core/dom/';
import { util } from './core/utils/';

import Selection from './components/selection/';
import Zoom from './components/zoom/';

export default class Timescale {
  components = {};

  colors = {
    'file-attack': '#e9847d',
    'process-attack': '#5baeef',
    'registry-attack': '#b17bb9',
    'network-attack': '#8ec519',
    'suspicious-activity': '#4bc580',
  };

  constructor({
    element = null,
    from = null,
    timeCells = [],
    hours = 24,
    hoursStep = 2,
    tickPerHour = 4,
    selection = false,
    zoom = true,
  }) {
    this.$element = element;
    this.from = from;
    this.timeCells = timeCells;
    this.hours = hours;
    this.hoursStep = hoursStep;
    this.scaleHours = this.calcHourOnScale();
    this.scaleRatio = 1 + (this.scaleHours - 24) / 24;
    this.tickPerHour = tickPerHour;
    this.ticksCount = this.scaleHours * this.tickPerHour;
    this.timesCount = this.scaleHours / this.hoursStep;
    this.clickTimer = null;
    this.init(selection, zoom);
  }

  init(selection, zoom) {
    this.initScale();
    this.initTimeCells();
    this.initTicks();
    this.initTimeLabels();
    // this.initComponents({ selection, zoom });
  }

  initComponents(collection) {
    if (collection['selection']) {
      let selection = new Selection({ element: this.$element });
      this.components = { selection };
    }

    if (collection['zoom']) {
      let zoom = new Zoom({ element: this.$cells });
      this.components = { zoom };
    }
  }

  /*
    SCALE
  */

  initScale() {
    let template = this.scaleTemplate;
    this.$scale = createElement(template);
    this.$element.append(this.$scale);
  }

  get scaleTemplate() {
    return `
      <div class="timescale-scale" style="width: ${
        this.scaleRatio.toFixed(4) * 100
      }%"></div>
    `;
  }

  /*
    TICKS
  */

  initTicks() {
    let template = this.ticksTemplate;
    this.$ticks = createElement(template);
    this.$scale.append(this.$ticks);
  }

  get ticksTemplate() {
    return `<div class="timescale-ticks">${this.getTicksItems()}</div>`;
  }

  getTicksItems() {
    let iterator = [...Array(this.ticksCount + 1)];

    let result = iterator.reduce((accumulator, item, index) => {
      let tickName = this.calcTickName(index);
      let tickXPos = this.calcTickXPosition(index);

      accumulator += `<div class="timescale-tick ${tickName}" style="left: ${tickXPos}%"></div>`;
      return accumulator;
    }, '');

    return result;
  }

  calcTickXPosition(index) {
    let xPos = (100 / this.ticksCount) * index;
    return xPos.toFixed(2);
  }

  calcTickName(index) {
    if (index % this.ticksCount === 0) {
      return 'big';
    }

    if (index % (24 * this.tickPerHour) === 0) {
      return 'big shift';
    }

    if (index % (this.hoursStep * this.tickPerHour) === 0) {
      return 'middle';
    }

    return 'small';
  }

  /*
    TIMELABELS
  */

  initTimeLabels() {
    let template = this.timeLabelsTemplate;
    this.$timeLabels = createElement(template);
    this.$scale.append(this.$timeLabels);
  }

  get timeLabelsTemplate() {
    return `<div class="timescale-times">${this.getTimeLabels()}</div>`;
  }

  getTimeLabels() {
    let iterator = [...Array(this.timesCount + 1)];

    let result = iterator.reduce((accumulator, item, index) => {
      let xPos = this.calcTimeXPosition(index);
      let timeLabel = this.calcTimeLabel(index);
      accumulator += `<div class="timescale-time" style="left: ${xPos}%">${timeLabel}</div>`;
      return accumulator;
    }, '');

    return result;
  }

  calcTimeXPosition(index) {
    let xPos = (100 / this.timesCount) * index;
    return xPos.toFixed(2);
  }

  calcTimeLabel(index) {
    let labelsPerDay = this.timesCount / this.scaleRatio;

    if (index === 0 || index % labelsPerDay === 0) {
      return `00:00`;
    }

    if (index / labelsPerDay > 1) {
      let rest = index % labelsPerDay;
      let seconds = rest * this.hoursStep * 3600;
      return util.secondsToTime(seconds).slice(0, -3);
    }

    let seconds = index * this.hoursStep * 3600;

    return util.secondsToTime(seconds).slice(0, -3);
  }

  /*
    TIMECELLS
  */

  initTimeCells() {
    let template = this.timeCellsTemplate;
    this.$cells = createElement(template);
    this.$scale.append(this.$cells);
  }

  get timeCellsTemplate() {
    return `<div class="timescale-cells">${this.getTimeCells()}</div>`;
  }

  getTimeCells() {
    let result = this.timeCells.reduce(
      (accumulator, { id, start, stop, type }, index) => {
        let color = this.colors[type];
        let xPos = this.calcTimeCellXPosition(start);
        let width = this.calcTimeCellWidth(start, stop);
        let float = this.checkTimeCellIsSmall(width);
        let duration = util.secondsToTime(stop - start);

        accumulator += util.trim`
          <div class="timescale-cell ${float ? 'float' : ''}"
            style="background-color: ${color}; left: ${xPos}%; width: ${width}%"
            data-id="${id}">
              <span>${duration}</span>
          </div>
        `;

        return accumulator;
      },
      ''
    );

    return result;
  }

  calcTimeCellWidth(start, stop) {
    let timeCellMs = (stop - start) * 1000;
    let result = (timeCellMs / (this.scaleHours * 3600 * 1000)) * 100;
    return result.toFixed(2);
  }

  checkTimeCellIsSmall(cellWidth) {
    let scaleWidth = this.$element.clientWidth * this.scaleRatio - 10;
    return (scaleWidth * cellWidth) / 100 < 45 ? true : false;
  }

  calcTimeCellXPosition(start) {
    let startCellDate = new Date(start * 1000);
    let cellStartMs = util.milliseconds(startCellDate);
    let fullDayInMs = this.scaleHours * 3600 * 1000;
    return ((cellStartMs * 100) / fullDayInMs).toFixed(2);
  }

  calcHourOnScale() {
    let overflowInHours = this.cellOverflowChecking();
    return this.hours + overflowInHours * this.hoursStep;
  }

  cellOverflowChecking() {
    let max = 0;

    this.timeCells.forEach(({ start, stop }) => {
      let result = this.calcCellOverflow(stop);
      if (result && max < result) {
        max = result;
      }
    });

    return Math.round(max);
  }

  calcCellOverflow(stop) {
    let cellEndTimestamp = stop * 1000;
    let nextDayTimestamp = this.from * 1000 + 3600 * this.hours * 1000;

    if (cellEndTimestamp > nextDayTimestamp) {
      let hours = (cellEndTimestamp - nextDayTimestamp) / 1000 / 60 / 60;
      return hours;
    }

    return false;
  }

  //
}
