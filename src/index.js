/**
 * @format
 */

import './style.scss';

import connectToObserver from './core/observer/connect';

import { createElement, getSubElements } from './core/dom/';
import { calcHours, round } from './core/utils/';

import Cells from './components/cells/';
import Ticks from './components/ticks/';
import Times from './components/times/';

class Timescale {
  components = {};
  subElements = [];
  subscriptions = [];

  constructor(
    root = null,
    { cells = [], from, hours = 24, step = 2 },
    observer
  ) {
    this.observer = observer;
    this.root = root;
    this.from = from;
    this.cells = cells;
    this.step = step;
    this.hours = calcHours(cells, from, hours, step);

    this.init();
  }

  init() {
    this.render();
    this.subElements = getSubElements(this.element);
    this.initComponents();
    this.renderComponents();
    this.initEventListeners();
    this.root.append(this.element);
  }

  render() {
    let template = this.template;
    this.element = createElement(template);
  }

  get template() {
    return `
      <div class="timescale-scale" style="width: ${this.scaleWidth}%">
        <div data-element="cells"></div>
        <div data-element="ticks"></div>
        <div data-element="times"></div>
      </div>
    `;
  }

  initComponents() {
    let cells = new Cells({ hours: this.hours, data: this.cells });
    let ticks = new Ticks({ hours: this.hours, step: this.step });
    let times = new Times({ hours: this.hours, step: this.step });

    this.components = { cells, ticks, times };
  }

  initEventListeners() {
    this.registerObserverEvent('move', this.move.bind(this));
    this.registerObserverEvent('zoom', this.zoom.bind(this));
  }

  renderComponents() {
    for (const componentName of Object.keys(this.components)) {
      const root = this.subElements[componentName];
      const { element } = this.components[componentName];
      root.append(element);
    }
  }

  registerObserverEvent(type, callback) {
    const handler = this.observer.subscribe(type, callback);
    this.subscriptions.push(handler);
  }

  move({ left }) {
    this.$scale.style.transform = `translateX(${left}%)`;
  }

  zoom({ width, left }) {
    this.$scale.style.width = `${width}%`;
    this.$scale.style.transform = `translateX(${left}%)`;
  }

  get scaleWidth() {
    let width = 100 + ((this.hours - 24) / 24) * 100;
    return Math.floor(width * 100) / 100;
  }

  //
}

export default connectToObserver(Timescale);
