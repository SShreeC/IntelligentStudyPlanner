const mongoose = require("../configuration/dbConfig");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  });
  
  // const User = mongoose.model("User", userSchema);
  module.exports=mongoose.model("User",userSchema);