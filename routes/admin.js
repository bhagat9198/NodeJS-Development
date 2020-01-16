const path = require('path');

const express = require('express');

const adminController = require('../controller/admin');

const routes = express.Router();

routes.get('/add-product', adminController.getAddProduct);

routes.post('/add-product', adminController.postAddProduct);

routes.get('/edit-product/:productID', adminController.getEditProduct);

routes.post('/edit-product', adminController.postEditProduct);

routes.post('/delete-product', adminController.postDeleteProduct);

routes.get('/products',adminController.getProducts)
module.exports = routes;
