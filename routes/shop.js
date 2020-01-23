const path = require('path');

const express = require('express');

const adminData = require('./admin');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  // we are rendering html pages but pages are not dynamic as we are not passing any values to them
  // res.render('shop');

  // to pass value to html pages, pass the value in 2nd argument
  // we passing value as an object
  res.render('shop', {pageTitle: 'Shop', prods : adminData.productArr, path : '/'});
  console.log('shope.js ', adminData.productArr);
});

module.exports = routes;


