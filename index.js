/**
 * @format
 */

import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Timescale from './src/';

(function () {
  let element = document.getElementById('player');
  new Plyr(element);
})();

(function () {
  // UTC время

  var cells = {
    1670803200: [
      {
        id: '0i75sxs678',
        start: 1670811600, // Mon Dec 12 2022 02:20:00 GMT+0000,
        stop: 1670814900, // Mon Dec 12 2022 03:15:00 GMT+0000,
        type: 'file-attack',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671550848/coverr-coding-developer-7198-1080p_e7fpcd.mp4',
      },
      {
        id: '92jjhsy657',
        start: 1670828400, // Mon Dec 12 2022 07:00:00 GMT+0000,
        stop: 1670830690, // Mon Dec 12 2022 07:38:10 GMT+0000,
        type: 'process-attack',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671552855/coverr-pencil-writing-and-erasing-7073-1080p_wik7ea.mp4',
      },
      {
        id: 'js892jdbds',
        start: 1670832000, // Mon Dec 12 2022 08:00:00 GMT+0000,
        stop: 1670836810, // Mon Dec 12 2022 09:20:10 GMT+0000,
        type: 'registry-attack',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671552883/coverr-pov-car-wash-9339-1080p_tccrc0.mp4',
      },
      {
        id: '0x9hhio54s',
        start: 1670842800, // Mon Dec 12 2022 11:00:00 GMT+0000,
        stop: 1670851399, // Mon Dec 12 2022 13:23:19 GMT+0000,
        type: 'network-attack',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671553283/coverr-tent-on-a-mountain-top-8476-1080p_qju3le.mp4',
      },
      {
        id: '7gs52b6fgs',
        start: 1670853600, // Mon Dec 12 2022 14:00:00 GMT+0000,
        stop: 1670854200, // Mon Dec 12 2022 14:10:00 GMT+0000,
        type: 'suspicious-activity',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671553478/coverr-cat-eating-grass-1749-1080p_jmg2se.mp4',
      },
      {
        id: '1hsyso85s7',
        start: 1670857200, // Mon Dec 12 2022 15:00:00 GMT+0000,
        stop: 1670860800, // Mon Dec 12 2022 16:00:00 GMT+0000,
        type: 'network-attack',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671553504/coverr-workers-typing-and-closing-their-laptops-4953-1080p_r9ttkj.mp4',
      },
      {
        id: '1hsyzo85a1',
        start: 1670882400, // Mon Dec 12 2022 22:00:00 GMT+0000
        stop: 1670892600, // Tue Dec 13 2022 00:50:00 GMT+0000
        type: 'registry-attack',
        url: 'https://res.cloudinary.com/dpelvtt5i/video/upload/v1671553504/coverr-workers-typing-and-closing-their-laptops-4953-1080p_r9ttkj.mp4',
      },
    ],
  };

  let element = document.getElementById('timescale');

  for (var property in cells) {
    new Timescale(element, {
      from: property,
      cells: cells[property],
    });
  }
})();
