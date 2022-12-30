/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { debounce } from '../../core/utils';

class Move {
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
    document.addEventListener('mouseup', this.onMouseUp);
    this.$element.addEventListener('dragstart', () => false);
  }

  onMouseDown(event) {
    this.xFrom = event.clientX;
    this.maxOffset = this.childWidth - this.parentWidth + 2;
    document.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    let newXpos = this.transformX + event.clientX - this.xFrom;

    if (newXpos < 1 && newXpos > -this.maxOffset) {
      this.xTo = newXpos;
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

  //
}

export default connectToObserver(Move);
