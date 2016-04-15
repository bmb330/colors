"use strict";

const express = require('express');
const app = express();
const colors = require('./colors.js');

app.get('/', (req, res) => {
  res.json(colors.parseColor(req.query.color));
  //res.send(colors.parseRgb(req.query.color));
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
