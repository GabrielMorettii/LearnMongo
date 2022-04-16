const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.getAllReviews = async (req, res) => {
  let filter = {};

  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  return res.json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
};

exports.createReview = async (req, res) => {
  const review = await Review.create({
    ...req.body,
    tour: req.body.tour || req.params.tourId,
    user: req.body.user || req.user._id
  });

  return res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
};

exports.deleteReview = factory.deleteOne(Review);
