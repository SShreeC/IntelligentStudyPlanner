const mongoose = require('mongoose');

// Define the Subject schema
const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, { timestamps: true }); // Automatically manage createdAt and updatedAt timestamps

// Create the Subject model
const Subject = mongoose.model('Subject', subjectSchema);

// Export the model
module.exports = Subject;
