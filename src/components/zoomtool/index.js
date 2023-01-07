/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { getTranslate, round } from '../../core/utils/';

class Zoom {
  constructor({ element }, observer) {
    this.observer = observer;
    this.$element = element;
    this.$scale = this.$element.parentNode;
    this.zoomLevel = 1;
    this.initialOffset = this.offset;
    this.init();
  }

  get offset() {
    let value =
      ((this.widthScale - this.widthContainer) / this.widthScale) * 100;
    return Math.ceil(value * 100) / 100;
  }

  get widthContainer() {
    return this.$scale.parentNode.getBoundingClientRect().width;
  }

  get widthScale() {
    return this.$scale.getBoundingClientRect().width;
  }

  init() {
    this.initEventListeners();
  }

  initEventListeners() {
    this.$element.addEventListener('click', this.onClick.bind(this));
    this.$element.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.$element.addEventListener('mousewheel', this.onMouseWheel.bind(this));
  }

  onClick(e) {
    // If single click on time cell
    if (e.detail === 1 && e.target.dataset.id) {
      this.cellClickTimer = setTimeout(() => {
        console.log('CELL CLICK');
      }, 200);
      return;
    }
    // If single click on scale
    // if (e.detail === 1 && !e.target.dataset.id) {
    //   this.scaleClickTimer = setTimeout(() => {
    //     this.calcShift(e);
    //     console.log('SCALE CLICK');
    //   }, 200);
    //   return;
    // }
  }

  onDoubleClick(e) {
    // If double click on time cell
    if (e.detail === 2 && e.target.dataset.id) {
      clearTimeout(this.cellClickTimer);
      this.calcZoomValue(e);
      console.log('CELL DOUBLE CLICK');
      return;
    }

    if (e.detail === 2 && !e.target.dataset.id) {
      clearTimeout(this.scaleClickTimer);
      this.calcZoomValue(e);
      return;
    }
  }

  calcZoomValue(e) {
    //
    let widthInPercent =
      Math.ceil((this.widthScale / this.widthContainer) * 10000) / 100;

    let value = widthInPercent * 2;

    let scaleOffsetX = this.$scale.getBoundingClientRect().x;
    let transformX = (getTranslate(this.$scale)[0] / this.widthScale) * 100;
    let cursorX = ((e.clientX - scaleOffsetX) / this.widthScale) * 100;

    let transformXPercent = round(transformX);
    let cursorXPercent = round(cursorX);

    this.zoomLevel *= 2;

    let shift =
      -cursorXPercent + (100 - this.initialOffset) / this.zoomLevel / 2;

    this.observer.dispatchEvent({ type: 'zoom', payload: { value, shift } });

    return 0;
  }

  zoom() {
    // this.dispatchZoomEvent();
    // let x = window.getComputedStyle(this.$element.parentNode).width;
    // console.log(x);
    // this.$element.parentNode.style.width = `100px`;
    // console.log(this.$element);
  }

  onMouseWheel() {}

  // dispatchZoomEvent(value) {
  //   // this.observer.dispatchEvent({ type: 'zoom', payload: { value } });
  // }

  dispatchClickEvent() {
    this.observer.dispatchEvent({ type: 'cell-click', payload: { url } });
  }

  //
}

export default connectToObserver(Zoom);
