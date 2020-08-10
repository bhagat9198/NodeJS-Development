const path = require('path');

const express = require('express');

// no more using html pages, as we are using ejs engine
// const rootDir = require('../util/path');
const productsController = require('../controller/products');

const routes = express.Router();

routes.get('/add-product', productsController.getAddProduct);

routes.post('/add-product', productsController.postAddProduct);

module.exports = routes;
