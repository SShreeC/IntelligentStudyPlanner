// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const controllerAuth=require("../controllers/login");
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/refresh-token', controllerAuth.refreshToken);
module.exports = router;
