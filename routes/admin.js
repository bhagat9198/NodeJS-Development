// core module
const path = require('path');

// 3rd party module
const express = require('express');

// user defined module
const rootDir = require('../util/path');

const routes = express.Router();

routes.get('/add-products', (req, res, next) => {
  // res.sendFile(path.join(__dirname, '..', 'views', 'add-product.html'));

  res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

routes.post('/add-products', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports= routes;