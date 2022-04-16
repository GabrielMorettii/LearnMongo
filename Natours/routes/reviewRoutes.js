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

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
