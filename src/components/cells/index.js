/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { secToTime, getMsFromDate, round } from '../../core/utils/';

class Cells {
  element = null;
  zoomLevel = 1;

  constructor({ data = [], hours = 24 }, observer) {
    this.data = data;
    this.hours = hours;
    this.observer = observer;
    this.init();
  }

  init() {
    this.render();
    this.addIndicator(this.element.firstElementChild);
    this.initEventListeners();
    this.initResizeObserver();
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  get template() {
    return `<div class="timescale-cells">${this.cells}</div>`;
  }

  get cells() {
    return this.data.reduce((template, { id, start, stop, type }, index) => {
      let left = this.calcLeft(start);
      let width = this.calcWidth(start, stop);
      let time = secToTime(stop - start);

      template += `
        <div
          class="timescale-cell"
          style="left: ${left}%; width: ${width}%"
          data-id="${id}"
          data-${type}
        >
          <span class="timescale-cell-front"></span>
          <span class="timescale-cell-text">${time}</span>
        </div>
      `;

      if (!index) {
        this.leftCellPos = left;
      }

      return template;
    }, '');
  }

  addIndicator(element) {
    let template = `<div class="timescale-cell-indicator"></div>`;
    if (this.indicator) {
      this.indicator.remove();
      this.indicator = null;
    }
    this.indicator = createElement(template);
    element.append(this.indicator);
  }

  updateIndicator(to) {
    let width = this.indicator.parentNode.style.width.slice(0, -1);
    this.indicator.style.width = `${round((to / width) * 100)}%`;
  }

  calcWidth(start, stop) {
    let ms = (stop - start) * 1000;
    return round((ms / this.totalHoursMs) * 100);
  }

  calcLeft(start) {
    let startDate = new Date(start * 1000);
    return round((getMsFromDate(startDate) / this.totalHoursMs) * 100);
  }

  get totalHoursMs() {
    return this.hours * 3600 * 1000;
  }

  initEventListeners() {
    this.element.addEventListener('click', this.onClick.bind(this));
    this.element.addEventListener('dblclick', this.zoom.bind(this));
  }

  initResizeObserver() {
    this.risizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentBoxSize[0].inlineSize;
        if (width <= 45) {
          entry.target.classList.add('float');
        } else {
          entry.target.classList.remove('float');
        }
      }
    });

    for (let cell of this.element.children) {
      this.risizeObserver.observe(cell);
      // this.risizeObserver.unobserve(cell)
    }
  }

  onClick(e) {
    if (e.detail !== 1 || !e.target.dataset.id) return;

    this.timer = setTimeout(() => {
      let to = parseFloat(e.target.style.left.slice(0, -1));
      this.addIndicator(e.target);
      this.observer.dispatchEvent({ type: 'cell.click', payload: e });
      this.observer.dispatchEvent({ type: 'cursor', payload: to });
    }, 200);
  }

  zoom(e) {
    clearTimeout(this.timer);

    let width = this.nextWidth;
    let cursor = this.calcCursorX(e.clientX);
    this.zoomLevel *= 2;

    let maxOffset =
      -((this.width * 2 - this.rootWidth) / (this.width * 2)) * 100;

    let shift = -cursor + (100 - this.offset) / this.zoomLevel / 2;

    let tranlateTo;

    if (shift >= 0) {
      tranlateTo = 0;
    } else if (shift < maxOffset) {
      tranlateTo = maxOffset;
    } else {
      tranlateTo = shift;
    }

    this.observer.dispatchEvent({
      type: 'zoom',
      payload: { width, tranlateTo },
    });
  }

  calcCursorX(x) {
    let cursor = ((x - this.elementOffset) / this.width) * 100;
    return cursor;
  }

  get offset() {
    if (this.cacheOffset) return this.cacheOffset;
    this.cacheOffset = ((this.width - this.rootWidth) / this.width) * 100;
    return this.cacheOffset;
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

  get nextWidth() {
    return (this.width / this.rootWidth) * 100 * 2;
  }

  get $root() {
    return this.element.closest('.timescale');
  }

  get firstElemPos() {
    return this.leftCellPos;
  }
}

export default connectToObserver(Cells);
