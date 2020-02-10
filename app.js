const http = require('http');

const express = require('express');
// requering
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();

// configuring body parser
// by default it will have use method i.e, (req,res,next) => {}
//            and next() will be pass it another middleware below it
// app.use(bodyParser.urlencoded());


// extended: true means that it should able to parse non-default features 
app.use(bodyParser.urlencoded({extended: true}));

app.use('/add-product', (req, res, next) => {
  // console.log("Another middleware");
  res.send('<form method="POST" action="/product"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.use('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
})

app.use('/', (req, res, next) => {
  // console.log("home middleware");
  res.send('<h1> Home Page</h1>');
});

app.listen(3000);
