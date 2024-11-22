const Profile = require('../models/Profile'); // Import the Profile model

// Get user data
const getuserdata = async (req, res) => {
  try {
    // Find the profile by email or any identifier
    const profile = await Profile.findOne({ email: req.query.email });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Post user data (Create new profile)
const postuserdata = async (req, res) => {
  try {
    const { name, email, headline, location, about, experiences, education, skills, projects } = req.body;
    // Check if the email already exists
    console.log('Received data:', { name, email, headline, location, about, experiences, education, skills, projects });
    const existingProfile = await Profile.findOne({ email });

    if (existingProfile) {
      await Profile.findOneAndDelete({ email });
    }

    const newProfile = new Profile({
      name,
      email,
      headline,
      location,
      about,
      experiences,
      education,
      skills,
      projects,
    });

    await newProfile.save();

    res.status(201).json({ message: 'Profile created successfully', profile: newProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user data
const updatinguserdata = async (req, res) => {
  try {
    const { email } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true } // Return the updated profile
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getuserdata, postuserdata, updatinguserdata };
