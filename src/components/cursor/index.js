/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';

import { createElement } from '../../core/dom';
// import { round } from '../../core/utils/';

class Cursor {
  element = null;

  constructor({}, observer) {
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  get template() {
    return `<div class="timescale-cursor"></div>`;
  }
}

export default connectToObserver(Cursor);
