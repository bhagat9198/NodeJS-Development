const express = require('express');

// "router" is now mini expreess app, tied/pluggable to other express app 
const routes = express.Router();
// router can be used with other express app such "use","get","post","put",etc
// router works same way as "app"

// /admin/add-product => GET
routes.get('/add-products', (req, res, next) => {
  res.send('<form action="/admin/add-products" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>');
});

// /admin/add-products => POST
routes.post('/add-products', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports= routes;