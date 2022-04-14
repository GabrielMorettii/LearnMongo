const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Please provider your  name']
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'Please provider your email'],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please provider your password']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have confirm a password']
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
