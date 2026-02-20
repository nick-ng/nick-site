require('dotenv').config();
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const http = require('http');

const { applyMiddlewares } = require('./src_server/middleware');
const { applyRouters } = require('./src_server/router');

const app = express();
const server = http.createServer(app);
const router = express.Router();

const port = process.env.PORT || 8080;
app.set('port', port);

app.use(
  cors({
    origin: '*',
    methods: 'GET',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(compression());
app.use(express.json());

applyMiddlewares(app);
applyRouters(router);
app.use(router);

// serve static files
app.use(express.static('assets'));
app.use(express.static('dist', { maxAge: '365d' }));

// redirect all requests to index.html
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

// starting listening
server.listen(app.get('port'), () => {
  console.info(`${new Date()} Website server listening on ${port}.`);
});
