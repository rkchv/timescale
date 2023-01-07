/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { round } from '../../core/utils';

class Movetool {
  constructor({ element }, observer) {
    this.observer = observer;
    this.$element = element;
    this.$parent = this.$element.closest('.timescale');
    this.xFrom = 0;
    this.xTo = 0;
    this.transformX = 0;
    this.init();
  }

  init() {
    this.bindings();
    this.initEventListeners();
  }

  bindings() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  initEventListeners() {
    this.$element.addEventListener('mousedown', this.onMouseDown);
    this.$element.addEventListener('dragstart', () => false);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown(event) {
    this.xFrom = event.clientX;
    let maxOffset = ((this.width - this.scaleWidth) / this.width) * 100;
    this.maxOffset = round(maxOffset);
    document.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    let shift = ((event.clientX - this.xFrom) / this.width) * 100;
    let newX = round(this.transformX + shift);

    if (newX !== this.xTo && newX <= 0 && newX >= -this.maxOffset) {
      this.xTo = newX;
      this.dispatchEvent(this.xTo);
    }
  }

  onMouseUp(event) {
    this.transformX = this.xTo;
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  get width() {
    return this.$element.getBoundingClientRect().width;
  }

  get scaleWidth() {
    return this.$parent.getBoundingClientRect().width;
  }

  dispatchEvent(value) {
    this.observer.dispatchEvent({ type: 'move', payload: { value } });
  }
}

export default connectToObserver(Movetool);
