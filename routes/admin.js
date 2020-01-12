// core module
const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

// "router" is now mini expreess app, tied/pluggable to other express app 
const routes = express.Router();

// router can be used with other express app such "use","get","post","put",etc
// router works same way as "app"

// /admin/add-products => GET
// routes.get('/add-products', (req, res, next) => {
//   res.send('<form action="/admin/products" method="POST"><input type="text" name="title"><button type="submit">Add</button></form>');
// });


// adding html instaed of passing html code
routes.get('/add-product', (req, res, next) => {
  // Error: as we are using absolute path of OS and not of project
  // res.sendFile('/views/addProducts.html'); 

  // using the path core module, to import the file
  // "__dirname" name is keyword which will point to current folder
  // while giving path, we dont have to put "/" at the end,as windows have differnt path pattern
  // res.sendFile(path.join(__dirname, '..', 'views', 'addProduct.html'));

  // using more cleaner way, setting path wrt main module ie (app.js)
  res.sendFile(path.join(rootDir, 'views', 'addProduct.html'));
});
  
// /admin/add-products => POST
routes.post('/add-product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports= routes;