const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/top-5-cheap')
  .get(tourController.alias, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.ensureAuthenticated, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(authController.ensureAuthenticated, tourController.getTour)
  .patch(
    authController.ensureAuthenticated,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.ensureAuthenticated,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
