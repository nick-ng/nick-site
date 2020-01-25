require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');

const contentful = require('./server_src/contentful');

const app = express();
const router = express.Router();

router.get('/api/wedding_photos', async (req, res, next) => {
    const photos = await contentful.getPhotoList();
    res.send(photos);
});

app.use(compression());

// https to http redirect
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

// redirects
app.use((req, res, next) => {
    if (req.url && req.url.includes('yt.nick.ng')) {
        return res.redirect('https://www.youtube.com/feed/subscriptions');
    }
    return next();
});

// serve static files
app.use(express.static('assets'));
app.use(express.static('dist'));

// router
app.use(router);

// redirect all requests to index.html
app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

// starting listening
const port = process.env.PORT || 3434;
app.listen(port, () => {
    console.log(`Website server listening on ${port}.`);
});
