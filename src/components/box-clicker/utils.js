export const getPosition = (el) => {
  var xPos = 0;
  var yPos = 0;

  while (el) {
    if (el.tagName == 'BODY') {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      var yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos += el.offsetLeft - xScroll + el.clientLeft;
      yPos += el.offsetTop - yScroll + el.clientTop;
    } else {
      // for all other non-BODY elements
      xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos,
  };
};

export const getMouseRelativePosition = (e) => {
  let x = 0;
  let y = 0;
  if (e.currentTarget) {
    const res = getPosition(e.currentTarget);
    x = res.x;
    y = res.y;
  }
  return {
    x: e.clientX - x,
    y: e.clientY - y,
  };
};

export const randomBlack = () => {
  let a = random(0, 4095).toString(16);
  a = `${'0'.repeat(3 - a.length)}${a}`;
  return a.split('').reduce((prev, curr) => `${prev}0${curr}`, '#');
};

export const randomWhite = () => {
  let a = random(0, 4095).toString(16);
  a = `${'f'.repeat(3 - a.length)}${a}`;
  return a.split('').reduce((prev, curr) => `${prev}f${curr}`, '#');
};

export const processReplay = (moveHistory, clickHistory) => {
  const history = moveHistory
    .map((a) => ({
      ...a,
      type: 'move',
    }))
    .concat(clickHistory.map((a, i) => ({ ...a, type: 'click', boxNumber: i })))
    .sort((a, b) => a.timestamp - b.timestamp);

  for (let i = 0; i < history.length; i++) {
    history[i].relativeTimestamp = history[i].timestamp - history[0].timestamp;

    if (i > 0) {
      history[i].delta = history[i].timestamp - history[i - 1].timestamp;
    } else {
      history[i].delta = 0;
    }
  }

  return history;
};
