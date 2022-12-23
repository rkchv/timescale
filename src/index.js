/**
 * @format
 */

import './style.scss';

export default class Timescale {
  colors = {
    'file-attack': '#E9847D',
    'process-attack': '#5BAEEF',
    'registry-attack': '#B17BB9',
    'network-attack': '#8EC519',
    'suspicious-activity': '#4BC580',
  };

  constructor({
    element = null,
    timeCells = [],
    hours = 24,
    hoursStep = 2,
    tickPerHour = 4,
    min = 1,
    max = 48,
  }) {
    this.$element = element;
    this.hours = hours;
    this.tickPerHour = tickPerHour;
    this.hoursStep = hoursStep;
    this.ticksCount = this.hours * this.tickPerHour;
    this.timesCount = this.hours / this.hoursStep;
    this.timeCells = timeCells;
    this.init();
  }

  init() {
    this.initScale();
    this.initTicks();
    this.initTimeLabels();
    this.initTimeCells();
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
        <div class="timescale-scale"></div>
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
      accumulator += `
        <div
          class="timescale-tick ${this.calcTickName(index)}"
          style="left: ${this.calcTickXPosition(index)}%"
        ></div>`;
      return accumulator;
    }, '');

    return result;
  }

  calcTickXPosition(index) {
    let xPos = (100 / this.ticksCount) * index;
    return xPos.toFixed(2);
  }

  calcTickName(index) {
    if (index === 0 || index === this.ticksCount) {
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
      accumulator += `
        <div
          class="timescale-time"
          style="left: ${this.calcTimeXPosition(index)}%">
          ${this.calcTimeLabel(index)}
        </div>
      `;
      return accumulator;
    }, '');

    return result;
  }

  calcTimeXPosition(index) {
    let xPos = (100 / this.timesCount) * index;
    return xPos.toFixed(2);
  }

  calcTimeLabel(index) {
    if (index === 0 || index === this.timesCount) {
      return `00:00`;
    }

    let timeLabel = this.secondsToTime(index * this.hoursStep * 3600);

    return timeLabel.slice(0, -3);
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
        let width = this.calcTimeCellWidth(start, stop);
        let xPos = this.calcTimeCellXPosition(start);
        let duration = this.calcTimeCellDuration(start, stop);
        let float = this.checkTimeCellForSmallSize(width);

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

  calcTimeCellXPosition(start) {
    let startCellDate = new Date(start * 1000);

    let hours = startCellDate.getUTCHours() * 3600 * 1000;
    let minutes = startCellDate.getUTCMinutes() * 60 * 1000;
    let seconds = startCellDate.getUTCSeconds() * 1000;
    let ms = startCellDate.getMilliseconds();

    let current = hours + minutes + seconds + ms;
    let rightBorder = this.hours * 3600 * 1000;

    return ((current * 100) / rightBorder).toFixed(2);
  }

  calcTimeCellWidth(start, stop) {
    let timeCellMs = (stop - start) * 1000;
    let result = (timeCellMs / (this.hours * 3600 * 1000)) * 100;
    return result.toFixed(2);
  }

  checkTimeCellForSmallSize(cellWidth) {
    console.log(this.$element);
    return ((this.$element.clientWidth - 10) * cellWidth) / 100 < 45
      ? true
      : false;
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
