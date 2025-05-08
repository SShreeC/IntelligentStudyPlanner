const mongoose = require('mongoose');

const scheduledTaskSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledStartTime: {
    type: Date,
    required: true
  },
  scheduledEndTime: {
    type: Date,
    required: true
  },
  scheduledBreakStartTime: {
    type: Date,
    required: true
  },
  scheduledBreakEndTime: {
    type: Date,
    required: true
  },
  scheduledDurationMinutes: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const ScheduledTask = mongoose.model('ScheduledTask', scheduledTaskSchema);

module.exports = ScheduledTask;