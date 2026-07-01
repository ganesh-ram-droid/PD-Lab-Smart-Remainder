const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');
const notificationValidator = require('../validators/notificationValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.post(
  '/register-token',
  notificationValidator.deviceTokenRules,
  validate,
  notificationController.registerDeviceToken
);
router.put(
  '/device-token',
  notificationValidator.deviceTokenRules,
  validate,
  notificationController.updateDeviceToken
);
router.delete(
  '/device-token',
  notificationValidator.deleteTokenRules,
  validate,
  notificationController.deleteDeviceToken
);
router.post('/send', notificationValidator.sendRules, validate, notificationController.sendNotification);
router.post(
  '/local-request',
  notificationValidator.localRules,
  validate,
  notificationController.createLocalNotificationRequest
);
router.post(
  '/schedule',
  notificationValidator.scheduleRules,
  validate,
  notificationController.scheduleNotification
);
router.post('/cancel', notificationValidator.cancelRules, validate, notificationController.cancelNotification);
router.post(
  '/reschedule',
  notificationValidator.rescheduleRules,
  validate,
  notificationController.rescheduleNotification
);
router.post(
  '/retry',
  notificationValidator.retryRules,
  validate,
  notificationController.retryFailedNotification
);
router.get('/history', notificationValidator.historyRules, validate, notificationController.getNotificationHistory);
router.get('/:id', notificationValidator.detailsRules, validate, notificationController.getNotificationDetails);

module.exports = router;
