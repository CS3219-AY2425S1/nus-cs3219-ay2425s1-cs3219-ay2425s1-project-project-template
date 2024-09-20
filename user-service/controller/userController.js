const bcrypt = require('bcryptjs');
const {
  findUserById,
  updateUserById,
} = require('./userManipulation');

// Update Profile
const updateProfile = async (req, res) => {
  const { username, password } = req.body;

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await updateUserById(req.user.id, updateData);
    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Server error.' });
  }
};

// View Profile
const viewProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
};

// OAuth Check
const oauthCheck = (req, res) => {
  // Implement your OAuth logic here
  res.json({ message: 'User has access to this API call' });
};

module.exports = {
  updateProfile,
  viewProfile,
  oauthCheck,
};
