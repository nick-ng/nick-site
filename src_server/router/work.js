const path = require('path');

module.exports = (router) => {
  router.get('/chesters/securitytoken', async (req, res, next) => {
    res.send('654321');
    return;
  });

  router.get('/chesters/pricebook', async (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../../assets/work/chesters.csv'));
    return;
  });
};
