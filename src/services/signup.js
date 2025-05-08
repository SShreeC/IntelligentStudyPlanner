const User = require("../models/user");
const bcrypt = require("bcrypt");

async function createUser(userData) {  // Corrected to lowercase 'u'
    const { name, email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);  // Add 'await'
    
    const createdUser = new User({
        name,
        email,
        password: hashedPassword,  // Corrected typo in the object
        role: "student"
    });

    const savedUser = await createdUser.save();  // Corrected typo
    return savedUser;
}

module.exports = { createUser };
