export const getAnswer = (minNumber = 1, maxNumber = 6) => {
  const answer = [];

  for (let n = 0; n < 4; n++) {
    const range = maxNumber - minNumber + 1;
    answer.push((Math.floor(Math.random() * range) + minNumber).toString());
  }

  return answer;
};

export const checkGuess = (guess, answer) => {
  const totalLength = Math.min(guess.length, answer.length);
  let tempGuess = [...guess];
  let tempAnswer = [...answer];
  const correct = [];
  for (let n = 0; n < totalLength; n++) {
    if (guess[n] === answer[n]) {
      correct.push(n);
    }
  }

  correct.forEach((m) => {
    tempGuess[m] = null;
    tempAnswer[m] = null;
  });
  tempGuess = [...tempGuess].filter((a) => a !== null);
  tempAnswer = [...tempAnswer].filter((a) => a !== null);

  let nearly = 0;
  for (let n = 0; n < tempGuess.length; n++) {
    if (tempAnswer.includes(tempGuess[n])) {
      nearly++;
      const index = tempAnswer.indexOf(tempGuess[n]);
      tempAnswer[index] = null;
      tempAnswer = [...tempAnswer].filter((a) => a !== null);
    }
  }

  return {
    correct: correct.length,
    nearly,
  };
};

export const getColour = (number, maxNumber) => {
  return 'white';
  const n = parseInt(number, 10);
  const colours = [
    '#ff8888', // red
    '#f0f000', // yellow
    '#00ee00', // green
    '#55aaff', // blue
    '#eeeeee', // light grey
    '#aaaaaa', // dark grey
  ];
  if (n < 1 || n > colours.length || maxNumber > colours.length) {
    return 'white';
  }

  return colours[n - 1];
};
