require('dotenv').config();
const express = require('express');
const compression = require('compression');
const path = require('path');
const http = require('http');

const { applyMiddlewares } = require('./src_server/middleware');
const { applyRouters } = require('./src_server/router');

const app = express();
const server = http.createServer(app);
const router = express.Router();

const port = process.env.PORT || 3435;
app.set('port', port);

app.use((req, res, next) => {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV !== 'development'
  ) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
});

app.use(compression());
app.use(express.json());

applyMiddlewares(app);
applyRouters(router);
app.use(router);

const oneDay = 1000 * 60 * 60 * 24;

// serve static files
app.use(express.static('assets'));
app.use(express.static('dist', { maxAge: oneDay * 30 }));

// redirect all requests to index.html
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

// starting listening
server.listen(app.get('port'), () => {
  console.info(`${new Date()} Website server listening on ${port}.`);
});
