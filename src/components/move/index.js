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
    this.$element.addEventListener('mouseup', this.onMouseUp);
    this.$element.addEventListener('dragstart', () => false);
  }

  onMouseDown(event) {
    this.xFrom = event.clientX;
    this.childWidth = parseFloat(window.getComputedStyle(this.$element).width);
    this.parentWidth = parseFloat(window.getComputedStyle(this.$parent).width);
    this.maxOffset = this.childWidth - this.parentWidth;
    this.$element.addEventListener('mousemove', this.onMouseMove);
  }

  onMouseMove(event) {
    let d = this.transformX + event.clientX - this.xFrom;

    if (d < 0 && d > -this.maxOffset) {
      this.xTo = this.transformX + event.clientX - this.xFrom;
      // this.dispatchEvent(this.xTo);
      debounce(this.dispatchEvent(this.xTo), 80);
    }
  }

  onMouseUp(event) {
    // event.preventDefault();
    console.log('Mouseup');
    this.transformX = this.xTo;
    this.$element.removeEventListener('mousemove', this.onMouseMove);
  }

  dispatchEvent(value) {
    this.observer.dispatchEvent({ type: 'move', payload: { value } });
  }

  //
}

export default connectToObserver(Move);
