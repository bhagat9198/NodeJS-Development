const express = require('express');
// "check": its checks the body, params, cookie, query parameters and so on. we can just add just 'body' or 'param', 'header' etc to check the certain set of features of incoming request
const { check, body } = require('express-validator/check')

const authController = require('../controller/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
  // just putting the array, so that we can get to know that within array is our validators.
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid Email')
    .custom((value, {req}) => {
      if(value === 'test@test.com') {
        throw new Error('This email address is forbidden');
      } 
      return true;
    }),
    body('password',
    'Password sould contain atlest 5 characters and should not have any speacial symbols')
    .isLength({min: 5})
    .withMessage()
    .isAlphanumeric(),

    body('confirmPassword')
    .custom((value, {req}) => {
      if(value !== req.body.password) {
        throw new Error('Password didnt match')
      }
      // if the all the condtions are true, passing the true value no next middleware
      return true;
    })
  ], authController.postSignup)
  

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
