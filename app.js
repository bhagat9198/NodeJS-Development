const http = require('http');

const express = require('express');

const routes = require('./routes');

const app = express();

app.use((req, res, next) => {
  console.log("First middleware");
  // allow the request to continue to the next middleware in line 
  next();
}); 

app.use((req, res, next) => {
  console.log("Second Middleware");
  // we can aline more middlewares if we want.
})

const server = http.createServer(app);

server.listen(3000);

