// models/profile.js
const mongoose = require("../configuration/dbConfig");


const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    gender: { type: String, required: true },
    occupation: { type: String, default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', profileSchema);
