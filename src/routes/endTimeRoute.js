
const express = require('express');
const router = express.Router();
const { addEndTimes, getEndTimes, updateEndTime, deleteEndTime } = require('../controllers/endTimeController');
const { authenticateToken } = require('../utils/jwtUtils');

router.post('/addEndTime', authenticateToken, addEndTimes);
router.get('/getEndTime', authenticateToken, getEndTimes);
router.put('/updateEndTime/:day', authenticateToken, updateEndTime);
router.delete('/deleteEndTime/:day', authenticateToken, deleteEndTime);

module.exports = router;
