const express = require('express');
const { ROUTES } = require('../../constants/routes');
const { addItem } = require('./post');

const router = express.Router();
router.post(ROUTES.ITEMS.CREATE, addItem);

module.exports = router;
