/**
 * @format
 */

export default class Zoom {
  constructor({ element }) {
    this.$element = element;
    this.init();
  }

  init() {
    this.initEventListeners();
  }

  initEventListeners() {
    this.$element.addEventListener('click', this.onSingleClick.bind(this));
    this.$element.addEventListener('dblclick', this.onDoubleClick.bind(this));
    this.$element.addEventListener('mousewheel', this.onMouseWheel.bind(this));
  }

  onSingleClick(event) {
    if (event.detail === 1) {
      this.clickTimer = setTimeout(() => {}, 200);
    }
  }

  onDoubleClick(event) {
    clearTimeout(this.clickTimer);
    let xPosition = event.clientX - this.$element.getBoundingClientRect().x;
    let elemWidth = this.$element.getBoundingClientRect().width;

    // console.log('Pos:', xPosition);
    // console.log('Width:', elemWidth);
    // console.log(((xPosition / elemWidth) * 100).toFixed(2));
    this.zoom();
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

  calcShift() {
    return 0;
  }

  //
}
