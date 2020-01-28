const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

module.exports = router;