/**
 * @format
 */

import connectToObserver from '../../core/observer/connect';
import { createElement } from '../../core/dom';

class Reset {
  element = null;

  constructor(observer) {
    this.observer = observer;
    this.init();
  }

  init() {
    this.render();
    this.initEventListeners();
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  initEventListeners() {
    this.element.addEventListener('click', this.onClick.bind(this));
  }

  onClick() {
    console.log(this.observer);
    this.observer.dispatchEvent({ type: 'reset' });
  }

  get template() {
    let disabled = this.isDisabled;
    return `<button class="button disabled" type="button">Reset</button>`;
  }

  show() {
    this.element.classList.remove('disabled');
  }

  hide() {
    this.element.classList.add('disabled');
  }
}

export default connectToObserver(Reset);
