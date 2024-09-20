const User = require('../model/User');

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Update user by ID
const updateUserById = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// Save a user
const saveUser = async (user) => {
  return await user.save();
};

// Add any additional user manipulation logic here

module.exports = {
  findUserByEmail,
  findUserById,
  updateUserById,
  saveUser,
};
