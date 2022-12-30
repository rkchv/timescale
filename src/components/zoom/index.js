/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

class Zoom {
  constructor({ element }, observer) {
    this.observer = observer;
    this.$element = element;
    this.shiftStart = 0;
    this.shiftDelta = 0;
    this.x = 0;
    this.init();
  }

  init() {
    this.bindings();
    this.initEventListeners();
  }

  bindings() {
    this.onScaleMouseDown = this.onScaleMouseDown.bind(this);
    this.onScaleMouseUp = this.onScaleMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    // this.test = this.test.bind(this);
  }

  initEventListeners() {
    this.$element.addEventListener('mousedown', this.onScaleMouseDown);
    this.$element.addEventListener('mouseup', this.onScaleMouseUp);
    // this.$element.addEventListener('click', this.onClick.bind(this));
    // this.$element.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.$element.addEventListener('dragstart', () => false);
    // this.$element.addEventListener('mousewheel', this.onMouseWheel.bind(this));
  }

  onClick(event) {
    // If single click on time cell
    if (event.detail === 1 && event.target.dataset.id) {
      this.cellClickTimer = setTimeout(() => {
        console.log('CELL CLICK');
      }, 200);
    }
  }

  onDoubleClick(event) {
    // If double click on time cell
    if (event.detail === 2 && event.target.dataset.id) {
      clearTimeout(this.cellClickTimer);
      console.log('CELL DOUBLE CLICK');
      return;
    }

    console.log('SCALE DOUBLE CLICK');

    // console.log('Width:', elemWidth);
    // console.log(((xPosition / elemWidth) * 100).toFixed(2));
    this.zoom();
  }

  onScaleMouseDown(event) {
    if (event.detail === 1 && !event.target.dataset.id) {
      // 400px
      this.shiftStart = event.clientX;
      console.log('SCALE MOUSEDOWN', this.shiftStart);
      this.$element.addEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseMove(event) {
    this.shiftDelta = this.x + event.clientX - this.shiftStart;
    this.dispatchEvent(this.shiftDelta);
  }

  onScaleMouseUp(event) {
    if (event.detail === 1 && !event.target.dataset.id) {
      this.x = this.shiftDelta;
      console.log('SCALE MOUSEUP');
      // this.xStart = event.clientX;
      this.$element.removeEventListener('mousemove', this.onMouseMove);
    }
  }

  zoom() {
    // let x = window.getComputedStyle(this.$element.parentNode).width;
    // console.log(x);
    // this.$element.parentNode.style.width = `100px`;
    // console.log(this.$element);
  }

  onMouseWheel(e) {
    // console.log(e);
  }

  dispatchEvent(value) {
    this.observer.dispatchEvent({ type: 'move', payload: { value } });
  }

  calcShift() {
    return 0;
  }

  //
}

export default connectToObserver(Zoom);
