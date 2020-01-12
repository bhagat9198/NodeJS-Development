const path = require('path');

const express = require('express');

const adminData = require('./admin');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  // we dont have to static html file, but a dynamic html pug file
  // res.sendFile(path.join(__dirname, '..', 'views', 'shope.html'));

  // in "app.js" we just told to use pug as our templating engine but didnt use till now
  // to display pug file
  
  // render() : given by express engine, use default templating whicgh we have specified and then return that template
  // thus, just giving the file name, not need to write ".pug" at the end of file
  res.render('shop');
  console.log('shope.js ', adminData.productArr);
});

module.exports = routes;

