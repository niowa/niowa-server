const express = require('express');
const { ROUTES } = require('../constants/routes');
const { isAuthenticated } = require('../auth/use');
const profile = require('./profile');
const session = require('./session');
const items = require('./items');

const router = express.Router();
router.use('/*', isAuthenticated);
router.use(ROUTES.PROFILE.BASE, profile);
router.use(ROUTES.SESSION.BASE, session);
router.use(ROUTES.ITEMS.BASE, items);

module.exports = router;
