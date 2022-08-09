module.exports = (app) => {
  app.use((req, res, next) => {
    if (req.subdomains.length === 1) {
      switch (req.subdomains[0].toLowerCase()) {
        case 'poe':
          return res.redirect('https://poe.pux.one');
        case 'roborally':
        case 'robot-race':
          return res.redirect('https://robot-race.pux.one/');
        case 'yt':
          return res.redirect('https://www.youtube.com/feed/subscriptions');
        default:
      }
    }
    return next();
  });
};
