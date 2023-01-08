/**
 * @format
 */

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import Timescale from './src/';

import data from './api/mock';

// -------------------------------

// Player
let plyrEl = document.getElementById('player');
let player = new Plyr(plyrEl);

// Timescale

let keyValue = Object.keys(cells)[0];

let timescale = new Timescale(document.getElementById('timescale'), {
  from: keyValue,
  cells: data[keyValue],
});

timescale.on('cell.click', play);

// console.log(timescale.cursor);

function play(e) {
  var id = e.target.dataset.id || null;
  if (!id) return;
  var url = data[keyValue].filter(item => item.id === id)[0].url;

  player.pause();
  player.source = {
    type: 'video',
    sources: [{ src: url, type: 'video/mp4', size: 720 }],
  };
  player.play();
}
