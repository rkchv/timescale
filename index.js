/**
 * @format
 */

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import Timescale from './src/';

import data from './api/mock';

// -------------------------------

// Player
let player = new Plyr(document.getElementById('player'));

player.on('timeupdate', event => {
  const instance = event.detail.plyr;
  timescale.moveCursor(instance.currentTime);
});

// Timescale

let keyValue = Object.keys(cells)[0];

let timescale = new Timescale(document.getElementById('timescale'), {
  from: keyValue,
  cells: data[keyValue],
});

timescale.on('cell.click', play);

function play(e) {
  var id = e.target.dataset.id || null;
  if (!id) return;
  var url = data[keyValue].filter(item => item.id === id)[0].url;

  player.pause();
  player.source = { type: 'video', sources: [{ src: url, type: 'video/mp4' }] };
  player.play();
}
