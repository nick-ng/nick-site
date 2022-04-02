const checkGuess = (guess, answer) => {
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

const testCheckGuess = (guess, answer, expectedHint) => {
  const actualHint = checkGuess(guess, answer);

  console.info('guess       ', JSON.stringify(guess));
  console.info('answer      ', JSON.stringify(answer));
  console.info('actualHint  ', JSON.stringify(actualHint));
  console.info('expectedHint', JSON.stringify(expectedHint));

  return JSON.stringify(expectedHint) === JSON.stringify(actualHint);
};

const main = () => {
  testCheckGuess(
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    ['wrong', 'nearly', 'nearly', 'nearly']
  );

  testCheckGuess(
    [1, 1, 1, 2],
    [3, 3, 3, 1],
    ['nearly', 'wrong', 'wrong', 'wrong']
  );

  testCheckGuess(
    [3, 4, 6, 2],
    [4, 6, 3, 2],
    ['nearly', 'nearly', 'nearly', 'correct']
  );
};

main();
