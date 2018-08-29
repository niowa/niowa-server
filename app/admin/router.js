const express = require('express');
const { ROUTES } = require('../constants/routes');
const { isAuthenticated, isAdmin } = require('../auth/use');
const profile = require('./profile');
const items = require('./items');
const session = require('./session');

const router = express.Router();

router.use('/*', isAuthenticated, isAdmin);

router.use(ROUTES.PROFILE.BASE, profile);
router.use(ROUTES.ITEMS.BASE, items);
router.use(ROUTES.SESSION.BASE, session);

module.exports = router;
