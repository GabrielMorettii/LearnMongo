const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  return res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
