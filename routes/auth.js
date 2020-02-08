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

// "withMessage()" print out the message we want.  it always refferes to field just before it ie left hand side.
// as we can add multiple checks and with each check, with each check we can display our own custom message
router.post('/signup', check('email').isAlphanumeric().withMessage('Cant use special characters other then @ sign').isEmail().withMessage('Please enter a valid Email'), authController.postSignup);

router.post('/signup', check('email').isEmail().withMessage('Invalid Email') , authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
