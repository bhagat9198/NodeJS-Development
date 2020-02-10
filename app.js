const http = require('http');

const express = require('express');

const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/add-product', (req, res, next) => {
  res.send('<form method="POST" action="/product"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
})

app.get('/', (req, res, next) => {
  res.send('<h1> Home Page</h1>');
});

app.listen(3000);
