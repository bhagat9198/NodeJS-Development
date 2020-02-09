const express = require('express');
const { check, body } = require('express-validator/check')

const authController = require('../controller/auth');
// requering
const User = require('../model/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
  [
    check('email')
    .isEmail()
    .withMessage('Please enter a valid Email')
    .custom((value, {req}) => {
      // if(value === 'test@test.com') {
      //   throw new Error('This email address is forbidden');
      // } 

      // return whatever error it gives us
      // express-validator will see if it returns true or false or promise as in our case.
      // so if the promise is solved without any error then it is treated as success but if it is not solved successfully ie if it is rejected then it will be stored as an error

      // thus, adding our own async code. async because we are reaching to our database which is not a instant task. but express validator will wait "findOne" for it to finish.
      return User.findOne({email: value})
      .then(userData => {
        if(userData) {
          // if user is present
          // a promise is build in JS object and with reject, we throw an error inside an promise.
          // and we can throw an error with our own message
          return Promise.reject('Email all ready exists. Please take another one');
        }
      })
      // we can use the catch block to catch the error, but we are not catch an error here
      // .catch(err => console.log(err));
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
      return true;
    })
  ], authController.postSignup)
  

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
