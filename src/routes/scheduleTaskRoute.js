const express = require('express');

const { authenticateToken } = require('../utils/jwtUtils');
const  {getScheduledTasks, getScheduledTasksByDateRange, addScheduledInstance, updateScheduledInstance, deleteScheduledInstance } = require('../controllers/scheduleTaskController');

const router = express.Router();
//new ones
router.get('/scheduledTasks', authenticateToken ,getScheduledTasks);

// Get scheduled tasks by date range
router.get('/scheduledTasksByDateRange', authenticateToken,getScheduledTasksByDateRange);

// Add a scheduled instance to a task
router.post('/addScheduledInstance/:taskId', authenticateToken,addScheduledInstance);

// Update a scheduled instance
router.put('/updateScheduledInstance/:taskId/:instanceId', authenticateToken,updateScheduledInstance);

// Delete a scheduled instance
router.delete('/deleteScheduledInstance/:taskId/:instanceId', authenticateToken,deleteScheduledInstance);

module.exports = router;