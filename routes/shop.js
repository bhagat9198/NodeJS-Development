const path = require('path');

const express = require('express');

const shopController = require('../controller/shop');

const routes = express.Router();

routes.get('/', shopController.getIndex);

routes.get('/products', shopController.getProduct);

routes.get('/products/:productId', shopController.getDetails);

routes.get('/cart', shopController.getCart);

routes.post('/cart', shopController.postCart);

routes.post('/cart-delete-item', shopController.postCartDeleteProduct);

routes.get('/orders', shopController.getOrders);

module.exports = routes;
