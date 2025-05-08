// controllers/profileController.js
const UserProfile = require('../models/profile');

// Create or update user profile
const addProfile = async (req, res) => {
    const { name, age, weight, height, gender, occupation } = req.body;
    const userId = req.user.id; // Get user ID from the authenticated request

    try {
        const profileData = {
            name,
            age,
            weight,
            height,
            gender,
            occupation,
            user: userId
        };

        // Update if exists, otherwise create a new profile
        const profile = await UserProfile.findOneAndUpdate(
            { user: userId }, // Find by user reference
            profileData,
            { new: true, upsert: true } // Upsert: Create if not exists
        );

        res.status(200).json({ message: 'Profile saved successfully', profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving profile' });
    }
  };
  
// Fetch user profile by userId
const getProfile = async (req, res) => {
    const userId = req.user.id; // Get userId from the authenticated user

    try {
        const profile = await UserProfile.findOne({ user: userId }); // Find by user
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

module.exports = {
    addProfile,
    getProfile,
};
