export const NumberGenerator = {
  counter: 0,
  getNumber: function () {
    if (++this.counter % 5 === 0) {
      return ' ';
    }

    return Math.floor(Math.random() * 10).toString();
  },
};
