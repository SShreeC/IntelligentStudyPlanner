// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const {addProfile,getProfile}= require('../controllers/profileController');
const { authenticateToken } = require('../utils/jwtUtils');


// Protect routes using the middleware
router.post('/profileAdd', authenticateToken,addProfile);
router.get('/profile/:userId', authenticateToken, getProfile); // Adjust if needed

module.exports = router;
