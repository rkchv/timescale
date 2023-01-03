/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

class Zoom {
  constructor({ element }, observer) {
    this.observer = observer;
    this.$element = element;
    this.init();
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
    // if (e.detail === 1 && e.target.dataset.id) {
    //   this.cellClickTimer = setTimeout(() => {
    //     console.log('CELL CLICK');
    //   }, 200);
    //   return;
    // }

    // If single click on scale
    if (e.detail === 1 && !e.target.dataset.id) {
      this.scaleClickTimer = setTimeout(() => {
        this.calcShift(e);
        console.log('SCALE CLICK');
      }, 200);
      return;
    }
  }

  onDoubleClick(event) {
    // If double click on time cell
    if (event.detail === 2 && event.target.dataset.id) {
      clearTimeout(this.cellClickTimer);
      console.log('CELL DOUBLE CLICK');
      return;
    }

    if (event.detail === 2 && !event.target.dataset.id) {
      clearTimeout(this.scaleClickTimer);
      console.log('SCALE DOUBLE CLICK');
      return;
    }

    // console.log('Width:', elemWidth);
    // console.log(((xPosition / elemWidth) * 100).toFixed(2));
    this.zoom();
  }

  calcShift(e) {
    // console.log('shift', e.clientX - e.target.off);
    return 0;
  }

  zoom() {
    // let x = window.getComputedStyle(this.$element.parentNode).width;
    // console.log(x);
    // this.$element.parentNode.style.width = `100px`;
    // console.log(this.$element);
  }

  onMouseWheel() {}

  dispatchZoomEvent(value, shift) {
    this.observer.dispatchEvent({ type: 'zoom', payload: { value, shift } });
  }

  dispatchClickEvent() {
    this.observer.dispatchEvent({ type: 'cell-click', payload: { url } });
  }

  //
}

export default connectToObserver(Zoom);
