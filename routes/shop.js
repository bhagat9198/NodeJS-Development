const path = require('path');

const express = require('express');

const shopController = require('../controller/shop');

const routes = express.Router();

routes.get('/', shopController.getIndex);

routes.get('/products', shopController.getProduct);

// if we have one more url as "/products/delete", then it should be above than "/products/:productID". if it is down, it will never reach this url as "/products/:productID" will get executed.
// eg:
// routes.get('/products/delete', shopController.getDetails);

// using the dynamic params in the url
// because of ":", now url wil be treated as "/products/1" or "/products/abcd" or anything. Instead of fixed url ie, "/products/:productID"
routes.get('/products/:productId', shopController.getDetails);

routes.get('/cart', shopController.getCart);

routes.get('/orders', shopController.getOrders);

module.exports = routes;
