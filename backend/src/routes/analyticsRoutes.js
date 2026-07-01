const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');
const analyticsValidator = require('../validators/analyticsValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.get('/dashboard', analyticsValidator.filterRules, validate, analyticsController.getDashboard);
router.get('/reminders', analyticsValidator.filterRules, validate, analyticsController.getReminderAnalytics);
router.get('/notifications', analyticsValidator.filterRules, validate, analyticsController.getNotificationAnalytics);
router.get('/context', analyticsValidator.filterRules, validate, analyticsController.getContextAnalytics);
router.get('/behavior', analyticsValidator.filterRules, validate, analyticsController.getBehaviorAnalytics);
router.get('/location', analyticsValidator.filterRules, validate, analyticsController.getLocationAnalytics);
router.get('/charts', analyticsValidator.filterRules, validate, analyticsController.getCharts);
router.get('/report', analyticsValidator.filterRules, validate, analyticsController.getReport);

module.exports = router;
