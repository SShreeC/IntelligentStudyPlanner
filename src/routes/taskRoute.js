

const express = require('express');
const { addTask, getTasks, addSubject, getSubjects ,updateTaskProgress,updateTaskScheduledDate,deleteSubject,updateSubject} = require('../controllers/taskController');
const { authenticateToken } = require('../utils/jwtUtils');
const { getTaskProgress } = require('../controllers/taskController');
const  {getScheduledTasks, getScheduledTasksByDateRange, addScheduledInstance, updateScheduledInstance, deleteScheduledInstance } = require('../controllers/scheduleTaskController');
const router = express.Router();

router.post('/add', authenticateToken, addTask);
router.get('/myTasks', authenticateToken, getTasks);
router.post('/subjects', authenticateToken, addSubject); // Route to add a subject
router.get('/getSub', authenticateToken, getSubjects); // Route to get subjects
router.put('/updateSub/:id', authenticateToken, updateSubject); 
router.delete('/deleteSub/:id', authenticateToken, deleteSubject);
router.put('/updateProgress/:taskId',authenticateToken,updateTaskProgress);
router.put('/updateScheduledDate/:taskId', authenticateToken, updateTaskScheduledDate);
router.get('/progress/:taskId', authenticateToken, getTaskProgress);




// Legacy route for updating scheduled date (maintaining compatibility)
// router.put('/updateScheduledDate/:taskId', authenticateToken,updateTaskScheduledDate);
module.exports = router;
