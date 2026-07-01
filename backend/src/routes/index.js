const express = require('express');

const homeRoutes = require('./homeRoutes');
const healthRoutes = require('./healthRoutes');
const versionRoutes = require('./versionRoutes');
const exampleRoutes = require('./exampleRoutes');
const authRoutes = require('./authRoutes');
const reminderRoutes = require('./reminderRoutes');
const contextRoutes = require('./contextRoutes');
const { locationRouter, geofenceRouter } = require('./locationRoutes');
const behaviorRoutes = require('./behaviorRoutes');
const notificationRoutes = require('./notificationRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const requestId = require('../middleware/requestId');

const router = express.Router();

router.use(requestId);

router.use('/', homeRoutes);
router.use('/api/health', healthRoutes);
router.use('/api/version', versionRoutes);
router.use('/api/example', exampleRoutes);
router.use('/api/auth', authRoutes);
router.use('/api/reminders', reminderRoutes);
router.use('/api/context', contextRoutes);
router.use('/api/location', locationRouter);
router.use('/api/geofence', geofenceRouter);
router.use('/api/behavior', behaviorRoutes);
router.use('/api/notifications', notificationRoutes);
router.use('/api/analytics', analyticsRoutes);

module.exports = router;
