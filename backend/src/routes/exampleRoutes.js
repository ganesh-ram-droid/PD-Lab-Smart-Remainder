const express = require('express');

const exampleController = require('../controllers/exampleController');
const exampleValidator = require('../validators/exampleValidator');
const validate = require('../validators/validate');

const router = express.Router();

router.get('/', exampleValidator.getExampleRules, validate, exampleController.getExample);

module.exports = router;
