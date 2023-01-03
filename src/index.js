/**
 * @format
 */

import './style.scss';

import connectToObserver from './core/observer/connect';
import { createElement } from './core/dom/';
import { util } from './core/utils/';

import Selection from './components/selection';
import Movetool from './components/movetool';

class Timescale {
  subscriptions = [];
  components = {};

  colors = {
    'file-attack': '#e9847d',
    'process-attack': '#5baeef',
    'registry-attack': '#b17bb9',
    'network-attack': '#8ec519',
    'suspicious-activity': '#4bc580',
  };

  constructor(
    element = null,
    // as State
    {
      from = null,
      timeCells = [],
      hours = 24,
      hoursStep = 2,
      tickPerHour = 4,
      // zoom = true,
      // selection = true,
    },
    observer
  ) {
    this.observer = observer;
    this.$element = element;
    this.from = from;
    this.timeCells = timeCells;
    this.hours = hours;
    this.hoursStep = hoursStep;
    this.tickPerHour = tickPerHour;
    this.scaleXpos = 0;
    this.init();
  }

  init() {
    this.initScale();
    this.initTimeCells();
    this.initTicks();
    this.initTimeLabels();
    this.initComponents();
    this.initEventListeners();
  }

  initComponents() {
    let move = new Movetool({ element: this.$times });
    // let selection = new Selection({ element: this.$times });
    this.components = { move };
  }

  initEventListeners() {
    this.registerObserverEvent('move', this.moveScale.bind(this));
  }

  moveScale({ value }) {
    this.$scale.style.transform = `translateX(${value}px)`;
  }

  // ----------------------------------------

  get timesCount() {
    return this.scaleHours / this.hoursStep;
  }

  get ticksCount() {
    return this.scaleHours * this.tickPerHour;
  }

  get scaleRatio() {
    return 1 + (this.scaleHours - 24) / 24;
  }

  get scaleHours() {
    return this.calcHourOnScale();
  }

  // get scaleXpos() {
  //   return 0;
  // }

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
    return `<div class="timescale-ticks">${this.ticks}</div>`;
  }

  get ticks() {
    let iterator = Array(this.ticksCount).fill(null);

    return [...iterator, null].reduce((template, item, index) => {
      let tickName = this.calcTickName(index);
      let tickXPos = this.calcTickXPosition(index);

      template += `<div class="timescale-tick ${tickName}" style="left: ${tickXPos}%"></div>`;
      return template;
    }, '');
  }

  calcTickXPosition(index) {
    let x = (100 / this.ticksCount) * index;
    return x.toFixed(2);
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
    this.$times = createElement(template);
    this.$scale.append(this.$times);
  }

  get timeLabelsTemplate() {
    // return `<div class="timescale-times" data-times>${this.timeLabels}</div>`;
    return `<div class="timescale-times">${this.timeLabels}</div>`;
  }

  get timeLabels() {
    let iterator = Array(this.timesCount).fill(null);

    return [...iterator, null].reduce((template, item, index) => {
      let left = this.calcTimeXPosition(index);
      let timeLabel = this.calcTimeLabel(index);
      template += `<div class="timescale-time" style="left: ${left}%">${timeLabel}</div>`;
      return template;
    }, '');
  }

  calcTimeXPosition(index) {
    let x = (100 / this.timesCount) * index;
    return x.toFixed(2);
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

  // Refactor
  getTimeCells() {
    let result = this.timeCells.reduce(
      (template, { id, start, stop, type }, index) => {
        let color = this.colors[type];
        let x = this.calcTimeCellXPosition(start);
        let width = this.calcTimeCellWidth(start, stop);
        let className = this.isFloating(width)
          ? 'timescale-cell float'
          : 'timescale-cell';
        let duration = util.secondsToTime(stop - start);

        template += `
          <div
            class="${className}"
            style="background-color: ${color}; left: ${x}%; width: ${width}%"
            data-id="${id}">
              <span>${duration}</span>
          </div>
        `;

        return template;
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

  isFloating(cellWidth) {
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

  registerObserverEvent(type, callback) {
    const handler = this.observer.subscribe(type, callback);
    this.subscriptions.push(handler);
  }
}

export default connectToObserver(Timescale);
