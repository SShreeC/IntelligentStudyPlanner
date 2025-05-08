const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");
const {verifyToken} =require('../utils/authMiddleware');
async function login(email, password) {
  try {
    const exisitingUser = await User.findOne({ email });
    if (!exisitingUser) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, exisitingUser.password);
    if (!isPasswordValid) {
      
      throw new Error("Incorrect password");
    }
    const token=generateToken(exisitingUser);
    return token;
  } catch (error) {
    console.log("login error",error.message);
    throw new Error("Invalid credentials");
  }
}
async function refreshToken(oldToken) {
 try {
  const decodedToken=verifyToken(oldToken);
  User.findById(decodedToken._id);
  if(!user)
  {
    throw new error("user not found");
  };
  const newToken=generateToken(user);
  return newToken;
 } catch (error) {
  throw new error("invalid token");
 } 
}
module.exports = { login };
