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
    for (const component of Object.keys(this.components)) {
      const root = this.subElements[component];
      const { element } = this.components[component];
      root.append(element);
    }
  }

  registerObserverEvent(type, callback) {
    const handler = this.observer.subscribe(type, callback);
    this.subscriptions.push(handler);
  }

  move({ value }) {
    this.element.style.transform = `translateX(${value}%)`;
  }

  zoom({ width, shift }) {
    this.element.style.width = `${width}%`;
    this.element.style.transform = `translateX(${shift}%)`;
  }

  get scaleWidth() {
    let width = 100 + ((this.hours - 24) / 24) * 100;
    return Math.floor(width * 100) / 100;
  }

  //
}

export default connectToObserver(Timescale);
