/**
 * @format
 */

import './style.scss';

import connectToObserver from './core/observer/connect';

import { createElement, getSubElements } from './core/dom/';
import { hoursOnScale, round } from './core/utils/';

import Cells from './components/cells/';
import Ticks from './components/ticks/';
import Times from './components/times/';
import Cursor from './components/cursor/';
import Reset from './components/reset/';

class Timescale {
  $root;
  $element;
  $scale;
  _data;
  _components = {};
  _subElements = [];
  _subscriptions = new Map();

  constructor(root = null, data = {}, observer) {
    this.$root = root;
    this.value = data;
    this.observer = observer; // injected
    this.init();
  }

  set value(data) {
    this._data = Object.freeze(data);
  }

  get value() {
    return Object.freeze(this._data);
  }

  init() {
    this.render();
    this._subElements = getSubElements(this.$element);
    this._initComponents();
    this._renderComponents();
    this._initEventListeners();
    this.$root.append(this.$element);
  }

  render() {
    let template = this.template;
    this.$element = createElement(template);
    this.$scale = this.$element.firstElementChild;
  }

  get template() {
    return `
      <div class="timescale-wrapper">
        <div class="timescale-scale" style="width: ${this.width}%">
          <div data-element="cells"></div>
          <div data-element="ticks"></div>
          <div data-element="times"></div>
          <div data-element="cursor"></div>
        </div>
        <div data-element="reset"></div>
      </div>
    `;
  }

  get width() {
    return round(100 + ((this.hours - 24) / 24) * 100);
  }

  get hours() {
    let data = { ...this.value };
    return hoursOnScale(data);
  }

  _initComponents() {
    let data = { ...this.value };

    let cells = new Cells(data);
    let ticks = new Ticks({ data });
    let times = new Times({ data });
    let cursor = new Cursor({ x: cells.borderLeft });
    let reset = new Reset();

    this._components = { cells, ticks, times, cursor, reset };
  }

  _initEventListeners() {
    this._registerObserverEvent('move', this.moveScale.bind(this));
    this._registerObserverEvent('zoom', this.zoomScale.bind(this));
    this._registerObserverEvent('reset', this.zoomReset.bind(this));
    this._registerObserverEvent('cursor', this.setCursor.bind(this));
  }

  _renderComponents() {
    for (const component of Object.keys(this._components)) {
      const $root = this._subElements[component];
      const { $element } = this._components[component];
      $root.append($element);
    }
  }

  on(type, callback) {
    this._registerObserverEvent(type, callback);
  }

  off(type, callback) {
    this._removeObserverEvent(type, callback);
  }

  _registerObserverEvent(type, callback) {
    let handler = this.observer.subscribe(type, callback);
    this._subscriptions.set(type, handler);
  }

  _removeObserverEvent(type, callback) {
    this._subscriptions.get(type)();
    this._subscriptions.delete(type);
  }

  moveScale(tranlateTo) {
    this.$scale.style.transform = `translateX(${round(tranlateTo)}%)`;
  }

  zoomScale({ width, level, tranlateTo }) {
    this.$scale.style.width = `${width}%`;
    this.$scale.style.transform = `translateX(${round(tranlateTo)}%)`;
    this._components.ticks.zoom(level);
    this._components.times.zoom(level);
    this._components.reset.show();
  }

  zoomReset() {
    this.$scale.style.width = `${this.width}%`;
    this.$scale.style.transform = `translateX(0)`;
    this._components.cells.zoomReset();
    this._components.ticks.zoomReset();
    this._components.times.zoomReset();
    this._components.reset.hide();
  }

  setCursor(to) {
    this._components.cursor.set(to);
  }

  moveCursor(time) {
    let to = round((time / (this.hours * 3600)) * 100, 4);
    this._components.cursor.move(to);
    this._components.cells.setBack(to);
  }

  update(data) {
    this.value = data;
    let newState = { ...this.value };

    this.$scale.style.width = `${this.width}%`;
    this._components.cells.update(newState);
    this._components.ticks.update(newState);
    this._components.times.update(newState);

    let to = this._components.cells.borderLeft;
    this._components.cursor.reset(to);
  }

  destroy() {}
}

export default connectToObserver(Timescale);
