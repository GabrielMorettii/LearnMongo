const { Router } = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.ensureAuthenticated,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
