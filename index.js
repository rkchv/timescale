/**
 * @format
 */

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import Timescale from './src/';

import data from './api/mock';

// -------------------------------

// Data
let keyValue = Object.keys(cells)[0];

// Player
let plyrEl = document.getElementById('player');
let player = new Plyr(plyrEl);

// Timescale
let timescaleEl = document.getElementById('timescale');

let timescale = new Timescale(timescaleEl, {
  from: keyValue,
  cells: data[keyValue],
});

timescale.on('cell.click', play);

function play(e) {
  var id = e.target.dataset.id || null;
  if (!id) return;
  var url = getUrl(data[keyValue], id);

  player.pause();
  player.source = { type: 'video', sources: [{ src: url, type: 'video/mp4' }] };
  player.play();
}

function getUrl(data, id) {
  return data.filter(item => item.id === id)[0].url;
}
