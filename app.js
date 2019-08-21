const express = require('express');
const cors = require('cors');

const stocks = require('./routes/stocks');

const app = express();

app.use(cors());

require('./passport');

app.use('/api/stocks', stocks);

app.use('/', function (req, res) {
  res.send('odata server works...');
});

module.exports = app;
