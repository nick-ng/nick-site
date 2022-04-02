export const getAnswer = (minNumber = 1, maxNumber = 6) => {
  const answer = [];

  for (let n = 0; n < 4; n++) {
    const range = maxNumber - minNumber + 1;
    answer.push((Math.floor(Math.random() * range) + minNumber).toString());
  }

  return answer;
};

/**
 * Given a guess and an answer, returns an array of whether each element in the guess was "correct", "nearly", or "wrong"
 *
 * @param {number[]} guess
 * @param {number[]} answer
 *
 * @returns {string[]}
 */
export const checkGuess = (guess, answer) => {
  const tempGuess = [...guess];
  const tempAnswer = [...answer];

  const hints = [];
  for (let n = 0; n < answer.length; n++) {
    if (guess[n] === answer[n]) {
      hints.push('correct');
      tempGuess[n] = null;
      tempAnswer[n] = null;
    } else {
      hints.push('unknown');
    }
  }

  for (let n = 0; n < answer.length; n++) {
    if (hints[n] === 'correct') {
      continue;
    } else if (tempAnswer.includes(tempGuess[n])) {
      hints[n] = 'nearly';
      const nearlyIndex = tempAnswer.findIndex((a) => a === tempGuess[n]);
      tempAnswer[nearlyIndex] = null;
    } else {
      hints[n] = 'wrong';
    }
  }

  return hints;
};

export const getColour = (hint) => {
  switch (hint) {
    case 'correct':
      return {
        color: 'white',
        backgroundColor: '#6AAA64',
      };
    case 'nearly':
      return {
        color: 'white',
        backgroundColor: '#C9B458',
      };
    case 'wrong':
    default:
      return {
        color: 'white',
        backgroundColor: '#787C7E',
      };
  }
};
