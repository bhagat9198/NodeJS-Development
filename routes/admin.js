const path = require('path');

const express = require('express');

const adminController = require('../controller/admin');

const isAuth = require('../middleware/is-auth');

const routes = express.Router();

routes.get('/add-product', isAuth, adminController.getAddProduct);

routes.post('/add-product', isAuth, adminController.postAddProduct);

routes.get('/products', isAuth,adminController.getProducts)

routes.get('/edit-product/:productID', isAuth, adminController.getEditProduct);

routes.post('/edit-product', isAuth, adminController.postEditProduct);

routes.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = routes;
