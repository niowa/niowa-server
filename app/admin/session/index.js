const express = require('express');
const { ROUTES } = require('../../constants/routes');
const post = require('./post');

const router = express.Router();

router.post(ROUTES.SESSION.CREATE, post.createSession);

module.exports = router;
