
const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const routes = express.Router();
// storing add-product value in an array
const products = [];

routes.get('/add-product', (req, res, next) => {

  res.sendFile(path.join(rootDir, 'views', 'addProduct.html'));
});

routes.post('/add-product', (req, res, next) => {
  // console.log(req.body);
  products.push({'title' : req.body.title});

  // output: admin.js [object] instaed of admin.js  [ { title: 'book' } ]
  // console.log('admin.js '+ products);

  // output: [ { title: 'book' } ]
  console.log('admin.js ', products);
  res.redirect('/');
});

// making 2 different routes
module.exports.routes = routes;
module.exports.productArr = products;