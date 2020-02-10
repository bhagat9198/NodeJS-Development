const http = require('http');

// requering express
const express = require('express');

const routes = require('./routes');

// executing "express" function
const app = express();

// const server = http.createServer(routes.handler);
const server = http.createServer(app);

server.listen(3000);

