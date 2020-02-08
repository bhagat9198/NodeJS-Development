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

// we can even create our custom validators also.
// we want 
router.post('/signup', 
  check('email')
  .isEmail()
  .withMessage('Please enter a valid Email')
  // creating custom validator. validator is created in a function
  // "value" : its value which we are checking. in our case its 'email'. and also passing req object
  .custom((value, {req}) => {
    if(value === 'test@test.com') {
      // throwing an error
      throw new Error('This email address is forbidden');
    } 
    // if all the validations are passed, else it will stuck here 
    return true;
  }), authController.postSignup);

router.post('/signup', check('email').isEmail().withMessage('Invalid Email') , authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
