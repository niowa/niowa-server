const express = require('express');
const use = require('./use');

const router = express.Router();

router.use('/*', use.isAuthenticated);

module.exports = router;
