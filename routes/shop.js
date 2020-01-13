const path = require('path');

const express = require('express');

const adminData = require('./admin');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  // "layout: false" is speacial keyword which is understood by handlerbars which tells us that we are not using anhy layouts. thus no error regarding layouts will pop up.
  // res.render('shop', {pageTitle: 'Shop', prods : adminData.productArr, path : '/', hasProducts : adminData.productArr.length > 0, layout: false});

  res.render('shop', {pageTitle: 'Shop', prods : adminData.productArr, path : '/', hasProducts : adminData.productArr.length > 0, activeShop: true, productCSS: true});

  console.log('shop.js ', adminData.productArr);
});

module.exports = routes;

