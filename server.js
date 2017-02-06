const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();

app.use(compression());

// https to http redirect
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') && req.header('x-forwarded-proto') === 'https') {
    return res.redirect(`http://${req.headers.host}${req.url}`);
  }
  return next();
});

// serve static files
app.use(express.static('dist'));

// redirect all 404s to index.html
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, './build/index.html'));
});


// starting listening
const port = process.env.PORT || 3434;
app.listen(port, () => {
  console.log(`Website server listening on ${port}.`);
});
