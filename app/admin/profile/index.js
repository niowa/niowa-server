const express = require('express');
const { ROUTES } = require('../../constants/routes');
const { addAdmin } = require('./promote');

const router = express.Router();
router.post(ROUTES.PROFILE.PROMOTE.BASE, addAdmin);

module.exports = router;
