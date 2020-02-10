const http = require('http');

const express = require('express');

const routes = require('./routes');

const app = express();

// app.use((req, res, next) => {
//   console.log("First middleware");
//   next();
// }); 

// app.use((req, res, next) => {
//   console.log("Second Middleware");
//   res.send('<h1>Hello from Express!</h1>');
// })

app.use('/add-product', (req, res, next) => {
  console.log("Another middleware");
  res.send('<h1>Add Product Page</h1>');
});

app.use('/', (req, res, next) => {
  console.log("home middleware");
  res.send('<h1> Home Page</h1>');
});

app.listen(3000);
