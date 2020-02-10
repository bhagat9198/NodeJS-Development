const http = require('http');

const express = require('express');

const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
  console.log("First middleware");
  next();
}); 

app.use((req, res, next) => {
  console.log("Second Middleware");
  res.send('<h1>Hello from Express!</h1>');
})

// const server = http.createServer(app);
// server.listen(3000);

app.listen(3000);
