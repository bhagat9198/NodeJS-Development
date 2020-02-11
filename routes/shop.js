const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  // res.sendFile(path.join(__dirname, '..', 'views', 'shop.html'));
  
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = routes;


