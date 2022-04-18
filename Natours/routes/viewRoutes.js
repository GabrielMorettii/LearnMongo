const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', viewsController.getTour);
router.get('/signup', viewsController.getSingupForm);
router.get('/login', viewsController.getLoginForm);
router.get(
  '/me',
  authController.ensureAuthenticated,
  viewsController.getAccount
);

router.post(
  '/submit-user-data',
  authController.ensureAuthenticated,
  viewsController.updateUserData
);

module.exports = router;
