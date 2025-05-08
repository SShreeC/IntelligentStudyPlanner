const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const Subject = require("../models/subject"); // Import the Subject model
const { authenticateToken } = require("../utils/jwtUtils");

// Webhook to handle various intents
router.post("/webhook", authenticateToken, async (req, res) => {
  const intent = req.body.queryResult.intent.displayName;
  const userId = req.user.id;

  try {
    if (intent === "Fetch Study Plan") {
      const date = req.body.queryResult.parameters.date;
      let tasks = await getTasksForDate(userId, date);
      if (tasks.length === 0) {
        return res.json({ fulfillmentText: "You have no tasks for this date." });
      }
      let responseText = "Here are your tasks:\n";
      tasks.forEach(task => {
        responseText += `• ${task.subject}: ${task.description} (Due: ${task.dueDate})\n`;
      });
      return res.json({ fulfillmentText: responseText });
    } 
    
    else if (intent === "Get Subjects") {
      let subjects = await Subject.find({ user: userId });
      if (subjects.length === 0) {
        return res.json({ fulfillmentText: "You have no subjects added yet." });
      }
      let responseText = "Your subjects:\n";
      subjects.forEach(subject => {
        responseText += `• ${subject.subject}\n`;
      });
      return res.json({ fulfillmentText: responseText });
    } 
    
    else if (intent === "Add Subject") {
      const subjectName = req.body.queryResult.parameters.subject;
      const existingSubject = await Subject.findOne({ subject: subjectName, user: userId });
      if (existingSubject) {
        return res.json({ fulfillmentText: "This subject already exists." });
      }
      const newSubject = new Subject({ subject: subjectName, user: userId });
      await newSubject.save();
      return res.json({ fulfillmentText: "Subject added successfully." });
    } 
    
    else if (intent === "Update Task Schedule") {
      const { taskId, scheduledStartDate, scheduledDurationMinutes } = req.body.queryResult.parameters;
      if (!scheduledStartDate || !scheduledDurationMinutes) {
        return res.json({ fulfillmentText: "Scheduled start date and duration are required." });
      }
      const startDate = new Date(scheduledStartDate);
      const scheduledEndDate = new Date(startDate);
      scheduledEndDate.setMinutes(startDate.getMinutes() + scheduledDurationMinutes);
      const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, user: userId },
        { scheduledStartDate: startDate, scheduledEndDate },
        { new: true, runValidators: true }
      );
      if (!updatedTask) {
        return res.json({ fulfillmentText: "Task not found or update not authorized." });
      }
      return res.json({ fulfillmentText: "Task rescheduled successfully." });
    } 
    
    else if (intent === "Get Task Progress") {
      const taskId = req.body.queryResult.parameters.taskId;
      const task = await Task.findOne({ _id: taskId, user: userId });
      if (!task) {
        return res.json({ fulfillmentText: "Task not found." });
      }
      const progress = task.progress || 0;
      return res.json({ fulfillmentText: `Task progress: ${progress}% completed.` });
    } 
    
    else {
      return res.json({ fulfillmentText: "Sorry, I didn't understand that request." });
    }
  } catch (error) {
    console.error(error);
    return res.json({ fulfillmentText: "An error occurred while processing your request." });
  }
});

// Helper function to get tasks for a specific date
async function getTasksForDate(userId, date) {
  return await Task.find({ user: userId, dueDate: date });
}

module.exports = router;
