module.exports = {
  /**
   * @param {string} key
   *
   * @returns {string}
   */
  getSafeKey: (key) => key.replaceAll(/[^a-z:]/gi, '-'),
};
