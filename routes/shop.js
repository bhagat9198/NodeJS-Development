const express = require('express');

const routes = express.Router();

routes.get('/', (req, res, next) => {
  res.send('<html><head><title>Main App</title></head><body><h1>Home Page</h1></body></html>');
});

module.exports = routes;