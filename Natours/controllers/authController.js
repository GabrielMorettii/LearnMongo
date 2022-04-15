const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendMail = require('../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt
  });

  const token = signToken(newUser._id);

  return res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide your email and password');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError('Incorrect email or password', 401);
  }

  const correct = await user.correctPassword(password, user.password);

  if (!correct) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user._id);

  return res.json({
    status: 'success',
    token
  });
};

exports.ensureAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(
      'You are not logged in! Please log in to get access',
      401
    );
  }

  const token = authHeader.split(' ')[1];

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const existentUser = await User.findById(decoded.id);

  if (!existentUser) {
    throw new AppError(
      'The user belonging to this token no longer exists!',
      401
    );
  }

  if (existentUser.changedPasswordAfter(decoded.iat)) {
    throw new AppError(
      'User recently changed password! Please log in again',
      401
    );
  }

  req.user = existentUser;

  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'You dont have permission to perform this action',
        403
      );
    }

    return next();
  };
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new AppError('There is not user with email address', 404);
  }

  const resetToken = user.resetPasswordWithToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a new password and a confirmation to: ${resetURL}\n
  If you didn't forgot your password, please just ignore this email!`;

  try {
    await sendMail({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message
    });

    return res.json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
      'There was an error sending the email. Please try another time!',
      500
    );
  }
};

exports.resetPassword = async (req, res) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('Token is valid or has expired!');
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);

  return res.json({
    status: 'success',
    token
  });
};
