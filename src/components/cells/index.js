/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
import { secToTime, msFromDate, hoursOnScale, round } from '../../core/utils/';

class Cells {
  _data;
  _zoomValue;
  $element;
  $back;

  constructor({ data = {} }, observer) {
    this.value = data;
    this._zoomValue = 1;
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
    this._initBack(); // back layer relevant for showing progress
    this._initResizeObserver();
    this._bind();
    this._initEventListeners();
  }

  /*
    Render
  */

  render() {
    let template = this.template;
    this.$element = createElement(template);
  }

  get template() {
    return `<div class="timescale-cells">${this.cells}</div>`;
  }

  get cells() {
    let cells;

    Object.values(this.value).forEach(item => {
      cells = item.reduce((template, { id, start, stop, type }, index) => {
        let left = this._calcLeft(start);
        let width = this._calcWidth(start, stop);
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

        return template;
      }, '');
    });

    return cells;
  }

  /*
    Background
  */

  _initBack($element = this.$firstCell) {
    let template = `<div class="timescale-cell-back"></div>`;
    if (this.$back) {
      this.$back.remove();
      this.$back = null;
    }
    this.$back = createElement(template);
    $element.append(this.$back);
  }

  /*
    Cell resize browser observer
  */

  _initResizeObserver() {
    if (this.risizeObserver) {
      this.risizeObserver.disconnect();
    }

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

    for (let cell of this.$element.children) {
      this.risizeObserver.observe(cell);
    }
  }

  /*
    Listeners
  */

  _bind() {
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  _initEventListeners() {
    this.$element.addEventListener('click', this.onClick);
    this.$element.addEventListener('dblclick', this.onDoubleClick);
  }

  onClick(e) {
    if (e.detail !== 1 || !e.target.dataset.id) return;
    let event = e;
    let target = event.target;
    let to = parseFloat(target.style.left.slice(0, -1));

    this._timer = setTimeout(() => {
      this._initBack(target);
      this.observer.dispatchEvent({ type: 'cell.click', payload: event });
      this.observer.dispatchEvent({ type: '_cursor', payload: to });
    }, 200);
  }

  onDoubleClick(e) {
    clearTimeout(this._timer);

    let currentWidth = (this.elementWidth / this.rootWidth) * 100;
    let newWdith = currentWidth * 2;
    let clickX = ((e.clientX - this.elementX) / this.elementWidth) * 100;

    if (typeof this.offset === 'undefined') {
      this.offset =
        ((this.elementWidth - this.rootWidth) / this.elementWidth) * 100;
    }

    this._zoomValue *= 2;

    let shift = -clickX + (100 - this.offset) / this._zoomValue / 2;
    let maxOffset = -((newWdith - 100) / newWdith) * 100;

    let tranlateTo;

    if (shift >= 0) {
      tranlateTo = 0;
    } else if (shift < maxOffset) {
      tranlateTo = maxOffset;
    } else {
      tranlateTo = shift;
    }

    this._zoom(newWdith, this._zoomValue, tranlateTo);
  }

  _zoom(width, level, tranlateTo) {
    this.observer.dispatchEvent({
      type: '_zoom',
      payload: { width, level, tranlateTo },
    });
  }

  /*
    Public
  */

  update(data) {
    this.value = data;
    this.$element.innerHTML = this.cells;
    this._initBack();
    this._initResizeObserver();
  }

  setBack(to) {
    let width = this.$back.parentNode.style.width.slice(0, -1);
    this.$back.style.width = `${round((to / width) * 100)}%`;
  }

  zoomReset() {
    this._zoomValue = 1;
  }

  /*
    Calculations
  */

  _calcWidth(start, stop) {
    let msOnCell = (stop - start) * 1000;
    return round((msOnCell / this.msOnScale) * 100);
  }

  _calcLeft(start) {
    let startDate = new Date(start * 1000);
    return round((msFromDate(startDate) / this.msOnScale) * 100);
  }

  get msOnScale() {
    let data = { ...this.value };
    return hoursOnScale(data) * 3600 * 1000;
  }

  get elementX() {
    return this.$element.getBoundingClientRect().x;
  }

  get rootWidth() {
    let root = this.$element.closest('.timescale');
    return root.getBoundingClientRect().width;
  }

  get elementWidth() {
    return this.$element.getBoundingClientRect().width;
  }

  get borderLeft() {
    return parseFloat(this.$firstCell.style.left.slice(0, -1));
  }

  get $firstCell() {
    return this.$element.firstElementChild;
  }

  destroy() {
    this.value = null;
    this._zoomValue = null;

    this.$back.remove();
    this.$back = null;

    this.observer = null;
    this.risizeObserver.disconnect();
    this.risizeObserver = null;

    this.$element.removeEventListener('click', this.onClick);
    this.$element.removeEventListener('dblclick', this.onDoubleClick);

    this.onClick = null;
    this.onDoubleClick = null;

    this.$element.remove();
    this.$element = null;
  }
}

export default connectToObserver(Cells);
