const User = require('../model/User');

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by token
const findByToken = async (token) => {
  return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
  })
}

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

// Delete a user
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

// Get all users
const getUsers = async () => {
  return await User.find();
};

// Delete all users
const deleteAllUsers = async () => {
  return await User.deleteMany();
};

module.exports = {
  findUserByEmail,
  findByToken,
  findUserById,
  updateUserById,
  saveUser,
  deleteUser,
  getUsers,
  deleteAllUsers,
};
