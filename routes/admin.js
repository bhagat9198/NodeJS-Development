
const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const routes = express.Router();
const products = [];

routes.get('/add-product', (req, res, next) => {
  res.render('addProduct', {path: "admin/add-product", pageTitle : 'Add Products', activeAddProduct: true, formsCSS: true, productCSS: true})
});

routes.post('/add-product', (req, res, next) => {
  products.push({'title' : req.body.title});
  console.log('admin.js ', products);
  res.redirect('/');
});

module.exports.routes = routes;
module.exports.productArr = products;