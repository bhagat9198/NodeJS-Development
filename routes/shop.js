const path = require('path');

const express = require('express');

const shopController = require('../controller/shop');
const isAuth = require('../middleware/is-auth');

const routes = express.Router();

routes.get('/', shopController.getIndex);

routes.get('/products', shopController.getProduct);

routes.get('/products/:productId', shopController.getDetails);

routes.get('/cart', isAuth, shopController.getCart);

routes.post('/cart', isAuth, shopController.postCart);

routes.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

routes.get('/orders', isAuth, shopController.getOrders);

routes.post('/create-order', isAuth, shopController.postOrder);

// adding new dynamic route
routes.get('/order/:orderId', isAuth, shopController.getInvoice);

module.exports = routes;
