module.exports = app => {
    app.use((req, res, next) => {
        if (req.subdomains.length === 1) {
            switch (req.subdomains[0].toLowerCase()) {
                case 'yt':
                    return res.redirect('https://www.youtube.com/feed/subscriptions');
                default:
            }
        }
        return next();
    });
};
