const express = require('express');

const authMiddleware = require('../middleware/authMiddleware');
const contextController = require('../controllers/contextController');
const contextValidator = require('../validators/contextValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.use(authMiddleware.authenticate);

router.post('/evaluate', contextValidator.evaluateRules, validate, contextController.evaluateContext);
router.post('/log', contextValidator.logRules, validate, contextController.storeContextLog);
router.get('/history', contextValidator.historyRules, validate, contextController.getContextHistory);
router.get(
  '/score/:reminderId',
  contextValidator.scoreRules,
  validate,
  contextController.calculateCurrentScore
);

module.exports = router;
