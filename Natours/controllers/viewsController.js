const Tour = require('../models/tourModel');
const User = require('../models/userModel');
// const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking')
    res.locals.alert =
      "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
  next();
};

exports.getOverview = async (req, res) => {
  const tours = await Tour.find();

  return res.render('overview', {
    title: 'All Tours',
    tours
  });
};

exports.getTour = async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    throw new AppError('There is no tour with that name.', 404);
  }

  return res.render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
};

exports.getSingupForm = (req, res) => {
  return res.render('signup', {
    title: 'create your account!'
  });
};

exports.getLoginForm = (req, res) => {
  return res.render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  return res.render('account', {
    title: 'Your account'
  });
};

// exports.getMyTours = async (req, res) => {
//   const bookings = await Booking.find({ user: req.user.id });

//   const tourIDs = bookings.map(el => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIDs } });

//   if (bookings.length === 0) {
//     return res.render('nullbooking', {
//       title: 'Book Tours',
//       headLine: `You haven't booked any tours yet!`,
//       msg: `Please book a tour and come back. 🙂`
//     });
//   }
//   return res.render('overview', {
//     title: 'My Tours',
//     tours
//   });
// };

exports.updateUserData = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  return res.render('account', {
    title: 'Your account',
    user: updatedUser
  });
};
