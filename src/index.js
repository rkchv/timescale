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
import Cursor from './components/cursor/';

class Timescale {
  _components = {};
  subElements = [];
  subscriptions = new Map();

  constructor(
    root = null,
    { from, cells = [], hours = 24, step = 2 },
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
    let width = 100 + ((this.hours - 24) / 24) * 100;

    return `
      <div class="timescale-scale" style="width: ${round(width)}%">
        <div data-element="cells"></div>
        <div data-element="ticks"></div>
        <div data-element="times"></div>
        <div data-element="cursor"></div>
      </div>
    `;
  }

  initComponents() {
    let cells = new Cells({ hours: this.hours, data: this.cells });
    let ticks = new Ticks({ hours: this.hours, step: this.step });
    let times = new Times({ hours: this.hours, step: this.step });
    let cursor = new Cursor();

    this._components = { cells, ticks, times, cursor };
  }

  initEventListeners() {
    this._registerObserverEvent('move', this.move.bind(this));
    this._registerObserverEvent('zoom', this.zoom.bind(this));
  }

  renderComponents() {
    for (const component of Object.keys(this._components)) {
      const root = this.subElements[component];
      const { element } = this._components[component];
      root.append(element);
    }
  }

  move({ value }) {
    this.element.style.transform = `translateX(${value}%)`;
  }

  zoom({ width, shift }) {
    this.element.style.width = `${round(width)}%`;
    this.element.style.transform = `translateX(${round(shift)}%)`;
  }

  on(type, callback) {
    this._registerObserverEvent(type, callback);
  }

  off(type, callback) {
    this._removeObserverEvent(type, callback);
  }

  _registerObserverEvent(type, callback) {
    let handler = this.observer.subscribe(type, callback);
    this.subscriptions.set(type, handler);
  }

  _removeObserverEvent(type, callback) {
    this.subscriptions.get(type)();
    this.subscriptions.delete(type);
  }

  get cursor() {
    return this._components.cursor;
  }

  //
}

export default connectToObserver(Timescale);
