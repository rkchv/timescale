/**
 * @format
 */

export const round = (number, count = 2) => {
  return Math.ceil(number * Math.pow(10, count)) / Math.pow(10, count);
};

// Need to refactor
export const secToTime = (timeInSeconds, times = false) => {
  let pad = function (num, size) {
    return ('000' + num).slice(size * -1);
  };

  let time = parseFloat(timeInSeconds).toFixed(3);
  let hours = Math.floor(time / 60 / 60);
  let minutes = Math.floor(time / 60) % 60;
  let seconds = Math.floor(time - minutes * 60);
  let milliseconds = time.slice(-3);

  if (times) {
    return pad(hours, 2) + ':' + pad(minutes, 2);
  }

  if (hours > 0) {
    return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
  }

  return pad(minutes, 2) + ':' + pad(seconds, 2);
};

export const msFromDate = date => {
  let hours = date.getUTCHours() * 3600 * 1000;
  let minutes = date.getUTCMinutes() * 60 * 1000;
  let seconds = date.getUTCSeconds() * 1000;
  let ms = date.getMilliseconds();
  return hours + minutes + seconds + ms;
};

export const translation = item => {
  const transArr = [];
  if (!window.getComputedStyle) {
    return;
  }
  const style = window.getComputedStyle(item);
  const transform = style.transform || style.webkitTransform;
  let mat = transform.match(/^matrix3d\((.+)\)$/);
  if (mat) {
    return parseFloat(mat[1].split(', ')[13]);
  }
  mat = transform.match(/^matrix\((.+)\)$/);
  mat ? transArr.push(parseFloat(mat[1].split(', ')[4], 10)) : transArr.push(0);
  mat ? transArr.push(parseFloat(mat[1].split(', ')[5], 10)) : transArr.push(0);

  return transArr;
};

export const hoursOnScale = (data = {}, hours = 24, step = 2) => {
  let from = Object.keys(data)[0];
  let cells = data[from];
  let offset = 0;

  function calcOffset(stop) {
    let cellEndTimestamp = stop * 1000;
    let nextDayTimestamp = from * 1000 + hours * 3600 * 1000;
    return (cellEndTimestamp - nextDayTimestamp) / 1000 / 60 / 60;
  }

  cells.forEach(({ start, stop }) => {
    let result = calcOffset(stop);

    if (result > 0 && offset < result) {
      offset = result;
    }
  });

  return hours + Math.ceil(offset) * step;
};
