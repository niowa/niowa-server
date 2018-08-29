const express = require('express');
const { ROUTES } = require('../../constants/routes');
const post = require('./post');
const get = require('./get');

const router = express.Router();

router.post(ROUTES.PROFILE.CREATE, post.createProfile);
router.get(ROUTES.PROFILE.GET, get.getProfile);

module.exports = router;
