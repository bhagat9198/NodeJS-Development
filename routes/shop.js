const path = require('path');

const express = require('express');

const shopController = require('../controller/shop');

const routes = express.Router();

routes.get('/', shopController.getIndex);

routes.get('/products', shopController.getProduct);

routes.get('/cart', shopController.getCart);

routes.get('/orders', shopController.getOrders);

module.exports = routes;
