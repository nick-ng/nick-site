const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();

app.use(compression());

// https to http redirect
app.use((req, res, next) => {
  if (req.url && req.url.includes('www.nick.ng')) {
    const newUrl = req.url.replace('www.nick.ng', 'nick.ng');
    return res.redirect(`https://${req.headers.host}${newUrl}`);
  }
  return next();
});

// serve static files
app.use(express.static('assets'));
app.use(express.static('dist'));

// redirect all requests to index.html
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'));
});

// starting listening
const port = process.env.PORT || 3434;
app.listen(port, () => {
  console.log(`Website server listening on ${port}.`);
});
