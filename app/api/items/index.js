const express = require('express');
const { ROUTES } = require('../../constants/routes');
const { getItem } = require('./get');

const router = express.Router();
router.get(ROUTES.ITEMS.GET, getItem);

module.exports = router;
