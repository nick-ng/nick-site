export const NumberGenerator = {
  counter: 0,
  getNumber: function () {
    if (++this.counter % 5 === 0) {
      return ' ';
    }

    return Math.floor(Math.random() * 10).toString();
  },
};

export const median = (numbers) => {
  const medianIndex = (numbers.length + 1) / 2;

  const sortedNumbers = [...numbers].sort(
    (a, b) => parseFloat(a) - parseFloat(b)
  );

  return (
    (sortedNumbers[Math.ceil(medianIndex)] +
      sortedNumbers[Math.floor(medianIndex)]) /
    2
  );
};
