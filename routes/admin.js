const express = require('express');

const routes = express.Router();

routes.get('/admin/add-products', (req, res, next) => {
  res.send('<form action="/admin/products" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>');
});

routes.post('/admin/products', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports= routes;