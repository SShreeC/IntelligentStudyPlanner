
const ScheduledTask = require('../models/scheduleTask');
const Task = require('../models/task');

// Get all scheduled tasks for the logged-in user
exports.getScheduledTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const scheduledTasks = await ScheduledTask.find({ userId }).populate('taskId');
    res.status(200).json(scheduledTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scheduled tasks', error: error.toString() });
  }
};

// Create or update a scheduled task
exports.updateScheduledTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;
    const { 
      scheduledStartTime, 
      scheduledEndTime, 
      scheduledBreakStartTime, 
      scheduledBreakEndTime, 
      scheduledDurationMinutes 
    } = req.body;

    // Check if the task exists and belongs to the user
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find existing scheduled task or create a new one
    let scheduledTask = await ScheduledTask.findOne({ taskId, userId });
    
    if (scheduledTask) {
      // Update existing scheduled task
      scheduledTask.scheduledStartTime = scheduledStartTime;
      scheduledTask.scheduledEndTime = scheduledEndTime;
      scheduledTask.scheduledBreakStartTime = scheduledBreakStartTime;
      scheduledTask.scheduledBreakEndTime = scheduledBreakEndTime;
      scheduledTask.scheduledDurationMinutes = scheduledDurationMinutes;
      
      await scheduledTask.save();
    } else {
      // Create new scheduled task
      scheduledTask = new ScheduledTask({
        taskId,
        userId,
        scheduledStartTime,
        scheduledEndTime,
        scheduledBreakStartTime,
        scheduledBreakEndTime,
        scheduledDurationMinutes
      });
      
      await scheduledTask.save();
    }

    res.status(200).json(scheduledTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating scheduled task', error: error.toString() });
  }
};

// Delete a scheduled task
exports.deleteScheduledTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const result = await ScheduledTask.findOneAndDelete({ taskId, userId });
    
    if (!result) {
      return res.status(404).json({ message: 'Scheduled task not found' });
    }

    res.status(200).json({ message: 'Scheduled task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting scheduled task', error: error.toString() });
  }
};

// Get scheduled tasks by date
exports.getScheduledTasksByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const userId = req.user._id;
    
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const scheduledTasks = await ScheduledTask.find({
      userId,
      scheduledStartTime: { $gte: startDate, $lte: endDate }
    }).populate('taskId');
    
    res.status(200).json(scheduledTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scheduled tasks for date', error: error.toString() });
  }
};





