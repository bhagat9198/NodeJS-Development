const path = require('path');

const express = require('express');

const productsController = require('../controller/products');

const routes = express.Router();

routes.get('/', productsController.getproduct);

module.exports = routes;
