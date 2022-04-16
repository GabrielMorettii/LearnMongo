const Review = require('../models/reviewModel');

exports.getAllReviews = async (req, res) => {
  const reviews = await Review.find();

  return res.json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
};

exports.createReview = async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user._id });

  return res.status(201).json({
    status: 'success',
    data: {
      review
    }
  });
};
