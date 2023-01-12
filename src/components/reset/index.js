/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { createElement } from '../../core/dom';

class Reset {
  $element;

  constructor(observer) {
    this.observer = observer;
    this.init();
  }

  init() {
    this.render();
    this._initEventListeners();
  }

  render() {
    let template = this.template;
    this.$element = createElement(template);
  }

  _initEventListeners() {
    this.$element.addEventListener('click', this.onClick.bind(this));
  }

  onClick() {
    this.observer.dispatchEvent({ type: '_reset' });
  }

  get template() {
    return `<button class="button disabled" type="button">Reset</button>`;
  }

  show() {
    this.$element.classList.remove('disabled');
  }

  hide() {
    this.$element.classList.add('disabled');
  }

  destroy() {
    this.$element.remove();
    this.$element = null;
    this.observer = null;
  }
}

export default connectToObserver(Reset);
