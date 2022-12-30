/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { createElement } from '../../core/dom/';
import { util } from '../../core/utils/';

class Selection {
  startX = null;
  startY = null;
  offsetElemX = null;
  offsetElemY = null;
  width = null;

  constructor({ element }) {
    this.$element = element;
    this.init();
  }

  init() {
    this.binding();
    this.initEventListeners();
  }

  binding() {
    this.setSize = this.setSize.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  initEventListeners() {
    this.$element.addEventListener('mousedown', this.onStart);
    document.addEventListener('mouseup', this.onFinish);
  }

  onStart(e) {
    this.offsetElemX = this.$element.getBoundingClientRect().x;
    this.offsetElemY = this.$element.getBoundingClientRect().y;
    this.startX = e.clientX - this.offsetElemX;
    this.startY = e.clientY - this.offsetElemY;
    this.$element.style.cursor = 'crosshair';
    document.addEventListener('mousemove', this.setSize);
    this.insertSelection();
  }

  onFinish(e) {
    this.$element.style.cursor = 'default';
    document.removeEventListener('mousemove', this.setSize);
    this.remove();
    this.clean();
    if (!e.target.dataset.times) return;
    this.dispatch();
  }

  insertSelection() {
    let template = this.template;
    this.$selection = createElement(template);
    this.$element.prepend(this.$selection);
  }

  setSize(e) {
    let width = e.clientX - this.offsetElemX - this.startX;
    let height = e.clientY - this.offsetElemY - this.startY;
    if (width < 1 || height < 1) return;
    this.$selection.style.width = `${width}px`;
    this.$selection.style.height = `${height}px`;
    this.width = width;
  }

  get template() {
    return util.trim`
      <div
        class="timescale-selection"
        style="left: ${this.startX}px; top: ${this.startY}px">
      </div>
    `;
  }

  remove() {
    if (!this.$selection) return;
    this.$selection.remove();
  }

  dispatch() {
    console.log('total width:', this.$element.offsetWidth);
    console.log('selection width:', this.width);
    console.log(
      `${((this.width / this.$element.offsetWidth) * 100).toFixed(2)}%`
    );
  }

  clean() {
    this.startX = null;
    this.startY = null;
    this.offsetElemX = null;
    this.offsetElemY = null;
  }

  destroy() {
    this.$element.removeEventListener('mousedown', this.onStart);
    document.removeEventListener('mouseup', this.onFinish);
  }

  // Рассчитать позицию сдвига по X в процентах
}

export default connectToObserver(Selection);
