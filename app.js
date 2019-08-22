const express = require('express');
const cors = require('cors');

const stocks = require('./stocks');

const app = express();

app.use(cors());

app.use('/stocks', stocks);

app.use('/', function (req, res) {
  res.send('odata server works...');
});

module.exports = app;
