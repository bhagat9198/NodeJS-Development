const path = require('path');

const express = require('express');

const adminController = require('../controller/admin');
// requring is-auth
const isAuth = require('../middleware/is-auth');

const routes = express.Router();

// till now, we have only passed one  middelware function to the route. but it not nessary, we can put multiple middleware function after the route.
// all the middleware function get executed from left to right. that is, if 1st one didnt satisfied, 2nd middleware function will get executed and so on till the time conditions is not met. as soon as conditions are met, another middelware function which is after that will not be executed.

// 1st function: "isAuth", as we have to make sure if user is logged in or not. first "isAuth" function will be executed
// if user is not logged in, it will be redired to logiin page by "isAuth" function and second "adminController.getAddProduct" argument, will not be needed.
// but if user is logged in, req will pass through "isAuth" and then "adminController.getAddProduct"
routes.get('/add-product', isAuth, adminController.getAddProduct);

// implement same for other routes
routes.post('/add-product', isAuth, adminController.postAddProduct);

routes.get('/products', isAuth,adminController.getProducts)

routes.get('/edit-product/:productID', isAuth, adminController.getEditProduct);

routes.post('/edit-product', isAuth, adminController.postEditProduct);

routes.post('/delete-product', isAuth, adminController.postDeleteProduct);


module.exports = routes;
