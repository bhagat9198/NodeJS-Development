const express = require('express');
// requring the subpackage from the 'express-validator' as its a very big package
// we will use "check" package, which is the package we use for all the validation logic.
// const expValidator = require('express-validator/check')
// "expValidator" will ab object . we need specific attribute of an object. thus using destructuring.
// "check" is the function
const { check } = require('express-validator/check')


const authController = require('../controller/auth');

const router = express.Router();

// we want to validate over "post" rotes as from post roures we are getting the data when user enters data in the form
router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

// validating email.
// adding a "check()" middleware which in return another middleware.
//  "check()" or ""check([])"" we can pass field we want to check or array of fields we want to check.
// "email" is the field name we have given in 'signup' form. thus, it will check the value which is comming from the email field name.
// "check('email')" is object upon which which we will call a method. this method wiull return a middleware. thus on "check('email')" object, we can call any method to do all kinds of checks. "isEmail()" is the package which will check the value from 'email' name field.
router.post('/signup', check('email').isEmail() , authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

//
router.post('/new-password', authController.postNewPassword);

module.exports = router;
