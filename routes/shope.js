const path = require('path');

const express = require('express');

const adminData = require('./admin');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'shope.html'));
  console.log('shope.js ', adminData.productArr);
});

module.exports = routes;

