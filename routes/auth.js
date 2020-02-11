const express = require('express');
const { check, body } = require('express-validator/check')

const authController = require('../controller/auth');
// requering
const User = require('../model/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', 
  // checking sanitization
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .normalizeEmail(),
    check('password')
      .trim()
  ],
  authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .normalizeEmail()
      .custom((value, {req}) => {
        return User.findOne({email: value})
        .then(userData => {
          if(userData) {
            return Promise.reject('Email all ready exists. Please take another one');
          }
        }) 
      }),
    body('password',
      'Password sould contain atlest 5 characters and should not have any speacial symbols')
      .isLength({min: 5})
      .withMessage()
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, {req}) => {
        if(value !== req.body.password) {
          // here error thrown is handled by validator behined the sceans. thus not using "catch" block.
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
