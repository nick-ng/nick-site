require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');

const contentful = require('./src_server/contentful');
const { applyMiddlewares } = require('./src_server/middleware');

const app = express();
const router = express.Router();

router.get('/api/wedding_photos', async (req, res, next) => {
    const photos = await contentful.getPhotoList();
    res.send(photos);
});
router.post('/api/test', (req, res, next) => {
    res.json({
        hello: res.locals.identity || 'world',
    });
});

app.use(compression());

// redirect
applyMiddlewares(app);

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
app.listen(port, () => console.log(`${new Date()} Website server listening on ${port}.`));
