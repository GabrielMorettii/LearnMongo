const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

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

exports.deleteMe = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  return res.status(204).send();
};
