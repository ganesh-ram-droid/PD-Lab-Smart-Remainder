const express = require('express');

const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const authValidator = require('../validators/authValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.post('/register', authValidator.registerRules, validate, authController.register);
router.post('/login', authValidator.loginRules, validate, authController.login);
router.get('/profile', authMiddleware.authenticate, authController.getProfile);
router.put(
  '/profile',
  authMiddleware.authenticate,
  authValidator.updateProfileRules,
  validate,
  authController.updateProfile
);
router.post('/logout', authMiddleware.authenticate, authController.logout);
router.delete('/delete', authMiddleware.authenticate, authController.deleteAccount);

module.exports = router;
