const path = require('path');

const express = require('express');

// no more using html pages, as we are using ejs engine
// const rootDir = require('../util/path');
const adminController = require('../controller/admin');

const routes = express.Router();

routes.get('/add-product', adminController.getAddProduct);

routes.post('/add-product', adminController.postAddProduct);

routes.get('/products',adminController.getProducts)

module.exports = routes;
