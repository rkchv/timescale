

export const util = {

  trim: (strings, ...values) => {
    let output = '';
    for (let i = 0; i < values.length; i++) {
      output += strings[i] + values[i];
    }
    output += strings[values.length];

    // Split on newlines.
    let lines = output.split(/(?:\r\n|\n|\r)/);

    // Rip out the leading whitespace.
    return lines
      .map(line => {
        return line.replace(/^\s+/gm, '');
      })
      .join(' ')
      .trim();
  },

}

export const debounce = (fn, delay = 0) => {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      fn.apply(this, args);

      timerId = null;
    }, delay);
  };
};

export const round = (number) => {
  return Math.ceil(number * 100) / 100;
}

export const secondsToDuration = (timeInSeconds) => {
  let pad = function (num, size) {
    return ('000' + num).slice(size * -1);
  };

  let time = parseFloat(timeInSeconds).toFixed(3);
  let hours = Math.floor(time / 60 / 60);
  let minutes = Math.floor(time / 60) % 60;
  let seconds = Math.floor(time - minutes * 60);
  let milliseconds = time.slice(-3);

  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
}

export const getMsFromDate = (date) => {
  let hours = date.getUTCHours() * 3600 * 1000;
  let minutes = date.getUTCMinutes() * 60 * 1000;
  let seconds = date.getUTCSeconds() * 1000;
  let ms = date.getMilliseconds();
  return hours + minutes + seconds + ms;
}

export const getTranslate = (item) => {
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
}

export const calcHours = (cells, from, hours, step) => {
  let maxOffset = 0;

  function calcMaxOffset(stop) {
    let cellEndTimestamp = stop * 1000;
    let nextDayTimestamp = from * 1000 + hours * 3600 * 1000;

    if (cellEndTimestamp > nextDayTimestamp) {
      let hours = (cellEndTimestamp - nextDayTimestamp) / 1000 / 60 / 60;
      return hours;
    }
  }

  cells.forEach(({ start, stop }) => {

    let result = calcMaxOffset(stop);

    if (result && maxOffset < result) {
      maxOffset = result;
    }
  });

  return hours + Math.round(maxOffset) * step;
}
