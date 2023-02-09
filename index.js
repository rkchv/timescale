/**
 * @format
 */

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

import Timescale from './src/index';

import { data, data2 } from './api/mock';

// Player
let player = new Plyr(document.getElementById('player'));

player.on('timeupdate', event => {
  const instance = event.detail.plyr;
  timescale.moveCursor(instance.currentTime);
});

player.on('ended', event => {
  const instance = event.detail.plyr;

  for (let value of Object.values(data)) {
    value.forEach((element, index) => {
      if (element.url === instance.source) {
        if (index === value.length) return;
        let nextIndex = index + 1;
        timescale.switchToCell(value[nextIndex].id);
        player.source = {
          type: 'video',
          sources: [{ src: value[nextIndex].url, type: 'video/mp4' }],
        };
        player.play();
      }
    });
  }
});

// Timescale
let element = document.getElementById('timescale');
let timescale = new Timescale(element, data);

timescale.on('cell.click', play);

// ------------------

function play(e) {
  var id = e.target.dataset.id || null;
  if (!id) return;

  let key = Object.keys(data)[0];
  var url = data[key].filter(item => item.id === id)[0].url;

  player.pause();
  player.source = { type: 'video', sources: [{ src: url, type: 'video/mp4' }] };
  player.play();
}

// setTimeout(() => {
//   timescale.update(data2);
// }, 5000);

// timescale.destroy();
