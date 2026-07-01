const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const behaviorController = require('../controllers/behaviorController');
const behaviorValidator = require('../validators/behaviorValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.post('/log', behaviorValidator.logRules, validate, behaviorController.logBehavior);
router.get('/history', behaviorValidator.historyRules, validate, behaviorController.getBehaviorHistory);
router.get('/profile', behaviorController.getLearningProfile);
router.post('/analyze', behaviorValidator.analyzeRules, validate, behaviorController.analyzeUserBehavior);
router.get('/prediction', behaviorController.predictBestReminderContext);

module.exports = router;
