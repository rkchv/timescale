/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { debounce } from '../../core/utils';

class Movetool {
  constructor({ element }, observer) {
    this.observer = observer;
    this.$element = element;
    this.$parent = this.$element.parentNode.parentNode;
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
    this.maxOffset = this.childWidth - this.parentWidth + 1;
    document.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    let newX = this.transformX + event.clientX - this.xFrom;

    if (newX !== this.xTo && newX < 1 && newX > -this.maxOffset) {
      this.xTo = newX;
      this.dispatchEvent(this.xTo);
    }
  }

  onMouseUp(event) {
    this.transformX = this.xTo;
    document.removeEventListener('mousemove', this.onMouseMove);
  }

  get childWidth() {
    return parseFloat(window.getComputedStyle(this.$element).width);
  }

  get parentWidth() {
    return parseFloat(window.getComputedStyle(this.$parent).width);
  }

  dispatchEvent(value) {
    this.observer.dispatchEvent({ type: 'move', payload: { value } });
  }
}

export default connectToObserver(Movetool);
