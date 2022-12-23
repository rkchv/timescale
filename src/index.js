/**
 * @format
 */

import './style.scss';

export default class Timescale {
  colors = {
    'file-attack': '#e9847d',
    'process-attack': '#5baeef',
    'registry-attack': '#b17bb9',
    'network-attack': '#8ec519',
    'suspicious-activity': '#4bc580',
  };

  constructor({
    element = null,
    timeCells = [],
    hours = 24,
    hoursStep = 2,
    tickPerHour = 4,
  }) {
    this.$element = element;
    this.cellOverflow = false;
    this.timeCells = timeCells;
    this.scaleHours = !this.cellOverflowChecking() ? hours : hours * 2;
    this.scaleRatio = !this.cellOverflowChecking() ? 1 : 2;
    this.tickPerHour = tickPerHour;
    this.hoursStep = hoursStep;
    this.ticksCount = this.scaleHours * this.tickPerHour;
    this.timesCount = this.scaleHours / this.hoursStep;
    this.init();
  }

  init() {
    this.initScale();
    this.initTimeCells();
    this.initTicks();
    this.initTimeLabels();
  }

  cellOverflowChecking() {
    let overflow = false;
    this.timeCells.forEach(({ start, stop }) => {
      if (!overflow) {
        overflow = this.calcTimeCellOverflow(start, stop);
      }
    });
    return overflow;
  }

  /*
    SCALE
  */

  initScale() {
    let template = this.scaleTemplate;
    this.$base = this.createElement({ template });
    this.$scale = this.$base.firstElementChild;
    this.$element.append(this.$base);
  }

  get scaleTemplate() {
    return `
      <div class="timescale">
        <div
          class="timescale-scale"
          style="width: ${this.scaleRatio * 100}%">
        </div>
      </div>
    `;
  }

  /*
    TICKS
  */

  initTicks() {
    let template = this.ticksTemplate;
    this.$ticks = this.createElement({ template });
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
    if (index % (this.ticksCount / this.scaleRatio) === 0) {
      if (index !== 0 && index % (this.hoursStep * this.tickPerHour) === 0) {
        return 'big shift';
      }
      return 'big';
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
    this.$timeLabels = this.createElement({ template });
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
      return this.secondsToTime(seconds).slice(0, -3);
    }

    let seconds = index * this.hoursStep * 3600;

    return this.secondsToTime(seconds).slice(0, -3);
  }

  /*
    TIMECELLS
  */

  initTimeCells() {
    let template = this.timeCellsTemplate;
    this.$timeCells = this.createElement({ template });
    this.$scale.append(this.$timeCells);
  }

  get timeCellsTemplate() {
    return `<div class="timescale-cells">${this.getTimeCells()}</div>`;
  }

  getTimeCells() {
    let result = this.timeCells.reduce(
      (accumulator, { id, start, stop, type }, index) => {
        let color = this.colors[type];
        let xPos = this.calcTimeCellXPosition(start);
        let duration = this.calcTimeCellDuration(start, stop);
        let width = this.calcTimeCellWidth(start, stop);
        let float = this.checkTimeCellIsSmall(width);

        accumulator += this.trim`
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

  calcTimeCellDuration(start, stop) {
    return this.secondsToTime(stop - start);
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
    let cellStartMs = this.calcTimeCellStartMs(startCellDate);
    let fullDayInMs = this.scaleHours * 3600 * 1000;
    return ((cellStartMs * 100) / fullDayInMs).toFixed(2);
  }

  calcTimeCellOverflow(start, stop) {
    let startCellDate = new Date(start * 1000);
    let stopCellDate = new Date(stop * 1000);

    let cellStartMs = this.calcTimeCellStartMs(startCellDate);
    let scaleLeftDate = this.startDayTimestamp(start, cellStartMs);
    let scaleRightDate = scaleLeftDate + 24 * 3600 * 1000;

    if (stopCellDate > scaleRightDate) {
      return true;
    }

    return false;
  }

  calcTimeCellStartMs(date) {
    let hours = date.getUTCHours() * 3600 * 1000;
    let minutes = date.getUTCMinutes() * 60 * 1000;
    let seconds = date.getUTCSeconds() * 1000;
    let ms = date.getMilliseconds();
    return hours + minutes + seconds + ms;
  }

  startDayTimestamp(startUnixTimestamp, passedMs) {
    return startUnixTimestamp * 1000 - passedMs;
  }

  /*
    Helper functions
  */

  createElement({ template, tagName = 'div' }) {
    let element = document.createElement(`${tagName}`);
    element.innerHTML = template;
    return element.firstElementChild;
  }

  secondsToTime(timeInSeconds) {
    let pad = function (num, size) {
      return ('000' + num).slice(size * -1);
    };

    let time = parseFloat(timeInSeconds).toFixed(3);
    let hours = Math.floor(time / 60 / 60);
    let minutes = Math.floor(time / 60) % 60;
    let seconds = Math.floor(time - minutes * 60);
    let milliseconds = time.slice(-3);

    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
  }

  trim(strings, ...values) {
    let output = '';
    for (let i = 0; i < values.length; i++) {
      output += strings[i] + values[i];
    }
    output += strings[values.length];

    // Split on newlines.
    let lines = output.split(/(?:\r\n|\n|\r)/);

    // Rip out the leading whitespace.
    return lines
      .map(line => {
        return line.replace(/^\s+/gm, '');
      })
      .join(' ')
      .trim();
  }

  //
}
