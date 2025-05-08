
// const Task = require('../models/task');
// const Subject = require('../models/subject'); // Import the Subject model
// const { authenticateToken } = require('../utils/jwtUtils');
// const { progress } = require('framer-motion');

// const addTask = async (req, res) => {
//   try {
//     // Ensure user information is available in req.user
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // Destructure the fields from the request body
//     const { subject, taskType, priority, dueDate, progress, description, scheduledStartDate } = req.body;
//     const userId = req.user.id; 

//     // Create a new task with the provided fields, while allowing optional fields to be omitted
//     const newTask = new Task({
//       subject,
//       taskType,
//       priority,
//       dueDate,
//       progress: progress || 0, // Defaults to 0 if not provided
//       description: description || '', // Defaults to an empty string if not provided
//       scheduledStartDate: scheduledStartDate || null, // Can be left empty if not provided
//       user: userId
//     });

//     await newTask.save();
//     res.status(201).json({ message: "Task added successfully", task: newTask });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error adding task", error });
//   }
// };

// const getTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find({ user: req.user.id });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tasks' });
//   }
// };

// // Function to add a subject
// const addSubject = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { subject } = req.body;
//     const userId = req.user.id;

//     // Check if the subject already exists for this user
//     const existingSubject = await Subject.findOne({ subject, user: userId });
//     if (existingSubject) {
//       return res.status(409).json({ message: "Subject already exists" });
//     }

//     const newSubject = new Subject({
//       subject,
//       user: userId
//     });

//     await newSubject.save();
//     res.status(201).json({ message: "Subject added successfully", subject: newSubject });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error adding subject", error });
//   }
// };

// // New function to get all subjects for a user
// const getSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.find({ user: req.user.id });
//     res.json(subjects);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching subjects', error });
//   }
// };


// const updateTaskProgress = async (req, res) => {
//   const { taskId } = req.params;
//   const { title, description, status, progress, scheduledStartDate } = req.body;

//   try {
//     // Update the task in the database
//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: taskId, user: req.user.id },
//       { title, description, status, progress, scheduledStartDate },
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: 'Task not found or not authorized to update' });
//     }

//     // Respond with the updated task data
//     res.status(200).json(updatedTask);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating task', error });
//   }
// }


// const updateTaskScheduledDate = async (req, res) => {
//   const { taskId } = req.params;
//   const { scheduledStartDate, scheduledDurationMinutes } = req.body;

//   try {
//     if (!scheduledStartDate || !scheduledDurationMinutes) {
//       return res.status(400).json({ message: "Scheduled start date and duration are required" });
//     }

//     const startDate = new Date(scheduledStartDate);
//     const scheduledEndDate = new Date(startDate);
//     scheduledEndDate.setMinutes(startDate.getMinutes() + scheduledDurationMinutes);

//     const updatedTask = await Task.findOneAndUpdate(
//       { _id: taskId, user: req.user.id },
//       { scheduledStartDate: startDate, scheduledEndDate }, // Ensure both times are updated
//       { new: true, runValidators: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: 'Task not found or not authorized to update' });
//     }

//     res.status(200).json(updatedTask);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating scheduled date', error });
//   }
// };


// const deleteSubject = async (req, res) => {
//   try {
//     const subjectId = req.params.id;
//     console.log("Deleting subject with ID:", subjectId); // Debug log

//     // Find and delete the subject by ID
//     const deletedSubject = await Subject.findByIdAndDelete(subjectId);
//     console.log("Deleted subject:", deletedSubject); // Debug log

//     // If subject not found, return 404
//     if (!deletedSubject) {
//       return res.status(404).json({ message: "Subject not found" });
//     }

//     // Return success response with deleted subject
//     res.status(200).json({
//       message: "Subject deleted successfully",
//       deletedSubject,
//     });
//   } catch (error) {
//     // Log the error and return 500 error response
//     console.error("Error in deleteSubject:", error);
//     res.status(500).json({
//       message: "Failed to delete subject",
//       error: error.message,
//     });
//   }
// };

// // Function to fetch the progress for each task of the logged-in user
// const getTaskProgress = async (req, res) => {
//   const { taskId } = req.params; // Get the task ID from the request parameters

//   try {
//     // Find the task by ID and ensure it belongs to the authenticated user
//     const task = await Task.findOne({ _id: taskId, user: req.user.id }).select('progress'); // Corrected placement of select()
// console.log(task.progress);
//     // Check if task was found
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found or not authorized to view' });
//     }

//     // Return only the progress field
//     res.json({ completed: task.progress.completed, remaining: task.progress.remaining });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error fetching task progress', error });
//   }
// };


// module.exports = {
//   addTask,
//   getTasks,
//   addSubject,
//   getSubjects,
//   updateTaskProgress,
//   updateTaskScheduledDate,deleteSubject,getTaskProgress,
// };








const Task = require('../models/task');
const Subject = require('../models/subject'); // Import the Subject model
const { authenticateToken } = require('../utils/jwtUtils');
const { progress } = require('framer-motion');

// Function to add a new task
const addTask = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject, taskType, priority, dueDate, progress, description, scheduledStartDate } = req.body;
    const userId = req.user.id; 

    const newTask = new Task({
      subject,
      taskType,
      priority,
      dueDate,
      progress: progress || 0, // Defaults to 0 if not provided
      description: description || '', // Defaults to an empty string if not provided
      scheduledStartDate: scheduledStartDate || null, 
      user: userId
    });

    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding task", error });
  }
};

// Function to get tasks for the authenticated user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Function to add a new subject
const addSubject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { subject } = req.body;
    const userId = req.user.id;

    const existingSubject = await Subject.findOne({ subject, user: userId });
    if (existingSubject) {
      return res.status(409).json({ message: "Subject already exists" });
    }

    const newSubject = new Subject({
      subject,
      user: userId
    });

    await newSubject.save();
    res.status(201).json({ message: "Subject added successfully", subject: newSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding subject", error });
  }
};

// Function to get all subjects for a user
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.id });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error });
  }
};

// Function to update a subject's details
const updateSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const { subject } = req.body;

    // Find the subject by ID and update its name
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: subjectId, user: req.user.id }, 
      { subject },
      { new: true, runValidators: true }
    );

    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found or not authorized to update" });
    }

    res.status(200).json({ message: "Subject updated successfully", updatedSubject });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update subject", error });
  }
};

// Function to delete a subject
const deleteSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;

    // Find and delete the subject by ID
    const deletedSubject = await Subject.findOneAndDelete({ _id: subjectId, user: req.user.id });

    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject deleted successfully",
      deletedSubject,
    });
  } catch (error) {
    console.error("Error in deleteSubject:", error);
    res.status(500).json({ message: "Failed to delete subject", error: error.message });
  }
};

// Function to update task progress
const updateTaskProgress = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, progress, scheduledStartDate } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id },
      { title, description, status, progress, scheduledStartDate },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized to update' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Function to update task scheduled date
const updateTaskScheduledDate = async (req, res) => {
  const { taskId } = req.params;
  const { scheduledStartDate, scheduledDurationMinutes } = req.body;

  try {
    if (!scheduledStartDate || !scheduledDurationMinutes) {
      return res.status(400).json({ message: "Scheduled start date and duration are required" });
    }

    const startDate = new Date(scheduledStartDate);
    const scheduledEndDate = new Date(startDate);
    scheduledEndDate.setMinutes(startDate.getMinutes() + scheduledDurationMinutes);

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: req.user.id },
      { scheduledStartDate: startDate, scheduledEndDate },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized to update' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating scheduled date', error });
  }
};

// Function to fetch task progress
const getTaskProgress = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOne({ _id: taskId, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized to view' });
    }

    // Assuming the task model has a 'progress' field
    const progress = {
      completed: task.progress || 0,
      remaining: 100 - (task.progress || 0)
    };

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching task progress', error });
  }
};


module.exports = {
  addTask,
  getTasks,
  addSubject,
  getSubjects,
  updateTaskProgress,
  updateTaskScheduledDate,
  deleteSubject,
  getTaskProgress,
  updateSubject, // Added update subject function
};
