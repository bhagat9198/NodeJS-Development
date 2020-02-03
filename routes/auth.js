const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

// setting up route, this route has been assigned while setting up the mail. ie "http://localhost:3000/reset/${token}"
router.get('/reset/:token', authController.getNewPassword);
module.exports = router;
