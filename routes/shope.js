const path = require('path');

const express = require('express');

const adminData = require('./admin');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'shope.html'));
  // accessing the products which were added 
  console.log('shope.js ', adminData.productArr);
});

module.exports = routes;

