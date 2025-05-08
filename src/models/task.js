// // const mongoose = require("../configuration/dbConfig");

// // const taskSchema = new mongoose.Schema({
// //   subject: { type: String, required: true },
// //   taskType: { type: String, enum: ["Assignment", "Study", "Practical"], required: true },
// //   priority: { type: String, enum: ["high", "medium", "low"], required: true },
// //   dueDate: { type:Date, required: true },
// //   // completed: { type: Boolean, required: false },
// //   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Reference to the User model
// // }, { timestamps: true });

// // const Task = mongoose.model("Task", taskSchema);

// // module.exports = Task;

// const mongoose = require("../configuration/dbConfig");

// const taskSchema = new mongoose.Schema({
//   subject: { type: String, required: true },
//   taskType: { type: String, enum: ["Assignment", "Study", "Practical"], required: true },
//   priority: { type: String, enum: ["high", "medium", "low"], required: true },
//   dueDate: { type: Date, required: true },
//   progress: { type: Number, default: 0 }, // Optional field, representing task completion percentage (0-100)
//   description: { type: String, default: '' }, // Optional field, additional details about the task
//   scheduledStartDate: { type: Date }, // Optional field for scheduling when the task starts
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Reference to the User model
// }, { timestamps: true });

// const Task = mongoose.model("Task", taskSchema);

// module.exports = Task;
const mongoose = require("../configuration/dbConfig");

const taskSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  taskType: { type: String, enum: ["Assignment", "Study", "Practical"], required: true },
  priority: { type: String, enum: ["high", "medium", "low"], required: true },
  dueDate: { type: Date, required: true },
  progress: { type: Number, default: 0 }, // Optional field, representing task completion percentage (0-100)
  description: { type: String, default: '' }, // Optional field, additional details about the task
  
  // Add an array to store multiple scheduled instances
  scheduledInstances: [{
    scheduledStartTime: { type: Date },
    scheduledEndTime: { type: Date },
    scheduledBreakStartTime: { type: Date },
    scheduledBreakEndTime: { type: Date },
    scheduledDurationMinutes: { type: Number },
    isCompleted: { type: Boolean, default: false }
  }],
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Reference to the User model
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;