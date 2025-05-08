const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correct_answer: { type: String, required: true },
    score: { type: Number, required: true }  // Score based on difficulty level
});

const QuizSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Quiz", QuizSchema);
