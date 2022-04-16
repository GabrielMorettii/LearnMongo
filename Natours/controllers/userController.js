const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getAllUsers = async (req, res) => {
  const users = await User.find();

  return res.json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
};

exports.updateMe = async (req, res) => {
  const { password, passwordConfirm, role, ...data } = req.body;

  if (password || passwordConfirm) {
    throw new AppError(
      'This route is not supposed to update the user password'
    );
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, data, {
    runValidators: true,
    new: true
  });

  return res.json({
    status: 'success',
    data: {
      user: updatedUser
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
